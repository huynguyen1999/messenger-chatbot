import { Module } from '@nestjs/common';
import { ReplierService } from './replier.service';

@Module({
  providers: [ReplierService]
})
export class ReplierModule {}
