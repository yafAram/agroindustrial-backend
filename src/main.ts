import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: ["http://localhost:3000"], credentials: true });

  const prisma = app.get(PrismaService);
  PrismaService.enableShutdownHooks(app);


  await app.listen(process.env.PORT ?? 3001);
  console.log("Listening on", process.env.PORT ?? 3001);
}
bootstrap();
