import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 허용 (React와 통신하기 위해)
  app.enableCors();

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Second Hand Platform API')
    .setDescription('중고거래 플랫폼 API 문서')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 버튼 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Server running: http://localhost:3000`);
  console.log(`📖 Swagger: http://localhost:3000/api`);
}

bootstrap();