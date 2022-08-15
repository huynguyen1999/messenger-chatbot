import { Injectable } from '@nestjs/common';
import { ISession } from './nlp.types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as util from 'util';
import { ConfigService } from '@nestjs/config';
import { NlpActionService } from './nlp.action.service';

@Injectable()
export class NlpService {
  private sessions: ISession;
  private witToken: string;
  private apiVersion: string;
  private witUri: string;
  private headers: any;
  constructor(
    private configService: ConfigService,
    private nlpActionService: NlpActionService,
  ) {
    this.witToken = configService.get<string>('facebook.wit_token');
    this.apiVersion = configService.get<string>('facebook.wit_version');
    this.witUri = configService.get<string>('facebook.wit_uri');
    this.headers = {
      Authorization: 'Bearer ' + this.witToken,
      'Content-Type': 'application/json',
    };
    //@ts-ignore
    this.sessions = {};
  }

  findOrCreateSession(fbid: string) {
    let sessionId: string = '';
    // Let's see if we already have a session for the user fbid
    Object.keys(this.sessions).forEach((k) => {
      if (this.sessions[k].fbid === fbid) {
        // Yep, got it!
        sessionId = k;
      }
    });
    if (!sessionId) {
      // No session found for user fbid, let's create a new one
      sessionId = uuidv4();
      this.sessions[sessionId] = { fbid: fbid, contextMap: {} };
    }
    return { sessionId, contextMap: this.sessions[sessionId].contextMap };
  }

  async message(messageText: string = '') {
    try {
      const result = await axios({
        method: 'GET',
        url: `${this.witUri}/message?v=${
          this.apiVersion
        }&q=${encodeURIComponent(messageText)}`,
        headers: this.headers,
      });
      return result.data;
    } catch (error) {
      console.log('error message');
    }
  }

  async runComposer(
    sessionId: string,
    contextMap: any,
    messageText: string = '',
  ) {
    try {
      const requestBody: any = {
        type: 'message',
        message: messageText,
      };
      let understanding: any = {};
      if (messageText != '') {
        understanding = await this.message(messageText);
      }
      const result = await axios({
        method: 'POST',
        url: `${this.witUri}/event?v=${
          this.apiVersion
        }&session_id=${sessionId}&context_map=${encodeURIComponent(
          JSON.stringify(contextMap),
        )}`,
        headers: this.headers,
        data: requestBody,
      });
      // process actions
      console.log(util.inspect(result.data, true, null, false));
      const { action, context_map, expects_input, stop, response } =
        result.data;

      this.sessions[sessionId].contextMap = context_map;
      understanding.user_id = this.sessions[sessionId].fbid;
      if (action) {
        const actionResult: any = await this.runAction(
          action,
          context_map,
          understanding,
        );
        const actionContextMap = actionResult?.context_map;
        if (expects_input && !stop) {
          await this.runComposer(sessionId, actionContextMap);
        }
      }

      if (response) {
        await this.nlpActionService.sendResponse(response, understanding);
      }

      return result.data;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async runAction(action: string, contextMap: any, understanding: any) {
    try {
      let result: any = null;
      switch (action) {
        case 'SET_ADDRESS':
          result = this.nlpActionService.setAddress(contextMap, understanding);
          break;
        case 'SET_PRODUCT':
          result = this.nlpActionService.setProduct(contextMap, understanding);
          break;
        case 'CONFIRM_ORDER':
          result = await this.nlpActionService.confirmOrder(
            contextMap,
            understanding,
          );
          break;
        case 'CLEAR_ORDER':
          result = this.nlpActionService.clearOrder(contextMap, understanding);
          break;
        case 'PROCESS_PAYMENT':
          result = await this.nlpActionService.processPayment(
            contextMap,
            understanding,
          );
          break;
        case 'SEND_PAYMENT_LINK':
          result = await this.nlpActionService.sendPaymentLink(
            contextMap,
            understanding,
          );
          break;
        default:
          result = this.nlpActionService.defaultAction(
            contextMap,
            understanding,
          );
          break;
      }
      return result;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
