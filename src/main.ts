import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(
    '/api/v1/static/images/',
    express.static(path.join(__dirname, '../public/qrcodes/')),
  );

  const config = new DocumentBuilder()
    .setTitle('ALX Student Attendance Management System')
    .setDescription(
      'API Documentation for ALX Student Attendance Management System',
    )
    .setVersion('1.0')
    .addTag('ALX Ethiopia')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  await app.listen(3000);
}
bootstrap();
