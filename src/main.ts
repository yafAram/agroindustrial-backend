import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // ✅ Validaciones globales
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Permitir conexión desde NextJS
  app.enableCors({
    origin: ['http://localhost:3000'], // frontend
    credentials: true,
  });

  // ✅ Puerto backend
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
