import { Module, DynamicModule } from '@nestjs/common';
import { NlpController } from './nlp.controller';
import { NlpService } from './nlp.service';
import { IWitOptions } from './nlp.types';

@Module({
  
})
export class NlpModule {
  static register(nlpOptions: IWitOptions): DynamicModule {
    return {
      module: NlpModule,
      controllers:[NlpController],
      providers: [
        {
          provide: 'NLP_OPTIONS',
          useValue: nlpOptions,
        },
        NlpService
      ],
      exports: [NlpService],
    };
  }
}
