import { Injectable } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { IntegrationsService } from '../integrations/integrations.service.js';

@Injectable()
export class ContactsService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly analyticsService: AnalyticsService,
    private readonly integrationsService: IntegrationsService,
  ) {}

  async handleContact(dto: any) {
    // 1️⃣ Upsert Lead
    const lead = await this.leadsService.upsert(dto);

    // 2️⃣ Track Event
    await this.analyticsService.track({
      type: 'contact_submit',
      data: {
        ...dto,
        leadId: lead.id,
      },
    });

    // 3️⃣ Disparar integraciones externas
    await this.integrationsService.dispatch({
      lead,
      event: 'contact_submit',
    });

    return {
      success: true,
      leadId: lead.id,
    };
  }
}
