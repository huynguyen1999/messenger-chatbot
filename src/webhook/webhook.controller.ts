import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Get()
  verifyWebhook(@Query() data: any, @Req() req: any, @Res() res: any) {
    try{
        const challenge = this.webhookService.verifyWebhook(data);
        res.status(200).send(challenge);
    }
    catch(error){
        res.status(403).json(error);
    }
  }

  @Post()
  async processWebhookEvents(
    @Body() body: any,
    @Req() req: any,
    @Res() res: any,
  ) {
    try{
        await this.webhookService.processWebhookEvents(body);
    }
    catch(error){
        res.status(403).json(error);
    }
  }
}
