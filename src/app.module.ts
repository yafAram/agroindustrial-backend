import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { PrismaModule } from './prisma/prisma.module.js';


@Module({
  imports: [ContactsModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
