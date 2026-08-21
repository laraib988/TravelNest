import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add response compression
  app.use(compression());

  // Fail fast: Global validation and transformation of DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const { json, urlencoded } = require('express');
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  
  const port = process.env.PORT || 4000;
  // Bind 0.0.0.0 so Render / cloud hosts can reach the service
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 TravelNest NestJS API Gateway running on http://0.0.0.0:${port}`);
}
bootstrap();
