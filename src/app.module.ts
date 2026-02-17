import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { IntegrationsModule } from './integrations/integrations.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { LeadsModule } from './leads/leads.module.js';


@Module({
    imports: [
    PrismaModule,
    LeadsModule,
    AnalyticsModule,
    IntegrationsModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
