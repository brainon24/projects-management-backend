import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const PORT = process.env.PORT || 8080;

  await app.listen(PORT);

  console.log('🚀 Server running on port', PORT);
}
bootstrap();
