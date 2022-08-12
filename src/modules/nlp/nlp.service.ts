import { Inject, Injectable } from '@nestjs/common';
import { Wit } from 'node-wit';
import { IWitOptions } from './nlp.types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


@Injectable()
export class NlpService extends Wit {
  public sessions: any;
  constructor(@Inject('NLP_OPTIONS') nlpOptions: IWitOptions) {
    super(nlpOptions);
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

  async message(q: string, context?: any) {
    return await super.message(q, context);
  }

  async runComposer(sessionId: string, contextMap: any, messageText: string) {
    try {
      const url = `https://api.wit.ai/event?session_id=${sessionId}&v=20220812&context_map=${encodeURIComponent(
        JSON.stringify(contextMap),
      )}`;

      const message = { type: 'message', message: messageText };
      const result = await axios.post(url, message, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer UJ3ENGWTQOI7KOPA5G3ZEVDWUHJCOJFA',
        },
      });
      console.log(result.data);
      this.sessions[sessionId].context = result?.data.context_map;
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
}
