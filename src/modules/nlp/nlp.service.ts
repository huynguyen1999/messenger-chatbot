import { Inject, Injectable } from '@nestjs/common';
import { Wit } from 'node-wit';
import { IWitOptions } from './nlp.types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as util from 'util';
import { ConfigService } from '@nestjs/config';
import { NlpActionService } from './nlp.action.service';

@Injectable()
export class NlpService {
  private sessions: any;
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
      this.sessions[sessionId] = { fbid: fbid, context: {} };
    }
    return { sessionId, contextMap: this.sessions[sessionId].context };
  }

  async message(messageText: string) {
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
      console.log('error: ', error);
    }
  }

  async runComposer(sessionId: string, contextMap: any, messageText?: string) {
    try {
      const requestBody: any = {};
      if (messageText) {
        requestBody.type = 'message';
        requestBody.message = messageText;
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
      const { action, context_map, expects_input, stop } = result.data;
      console.log(result.data);
      this.sessions[sessionId].contextMap = context_map;

      if (action) {
        const actionResult: any = await this.runAction(action, context_map);
        const actionContextMap = actionResult?.context_map;
        if (expects_input && !stop) {
          await this.runComposer(sessionId, actionContextMap, '');
        }
      }

      return result.data;
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async runAction(action: string, contextMap: any) {
    try {
      let result: any = null;
      switch (action) {
        case 'bruh':
          result = await this.nlpActionService.bruh(contextMap);
          break;
        case 'CONFIRM_ORDER':
          result = await this.nlpActionService.confirmOrder(contextMap);
          break;
        case 'PROCESS_PAYMENT':
          result = await this.nlpActionService.processPayment(contextMap);
          break;
        default:
          break;
      }
      return result;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}
