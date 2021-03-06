import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    .enableCors()
    .useGlobalPipes(new ValidationPipe());

  await app.listen(Config.get('/port'));
}
bootstrap();
