import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './configuration';
require('dotenv');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configs = configuration();
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () =>
    console.log(`App is listening at port ${PORT}...`),
  );
}
bootstrap();
