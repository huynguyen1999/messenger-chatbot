import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {configuration} from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configs = configuration();
  const PORT = configs.app.port || 3000;
  await app.listen(PORT, ()=>console.log(`App is listening at port ${PORT}...`));
}
bootstrap();
