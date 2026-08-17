import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
