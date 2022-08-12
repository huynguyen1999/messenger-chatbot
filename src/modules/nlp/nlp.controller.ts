import { Controller, Get } from "@nestjs/common";
import { NlpService } from "./nlp.service";
import {Wit} from 'node-wit'

@Controller("nlp")
export class NlpController {
    constructor(private nlpService:NlpService){}

    @Get("test")
    async test(){
        //@ts-ignore
        console.log(await this.nlpService.message("hello"));
        //@ts-ignore
        return await this.nlpService.message("hello");
    }
}