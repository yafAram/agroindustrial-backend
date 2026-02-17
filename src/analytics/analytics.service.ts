import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async track(event: { type: string; data?: any; leadEmail?: string; leadPhone?: string }) {
    // intentar vincular con lead si hay email/phone
  let leadId: number | null = null;
    if (event.leadEmail) {
      const l = await this.prisma.lead.findUnique({ where: { email: event.leadEmail } });
      if (l) leadId = l.id;
    } else if (event.leadPhone) {
      const l = await this.prisma.lead.findFirst({ where: { phone: event.leadPhone } });
      if (l) leadId = l.id;
    }

    return this.prisma.event.create({
      data: {
        type: event.type,
        payload: event.data ? event.data : undefined,
        leadId: leadId ?? undefined,
      },
    });
  }

  async identify(payload: { name?: string; email?: string; phone?: string; meta?: any }) {
    if (payload.email) {
      const existing = await this.prisma.lead.findUnique({ where: { email: payload.email } });
      if (existing) {
        return this.prisma.lead.update({
          where: { id: existing.id },
          data: {
            name: payload.name ?? existing.name,
            phone: payload.phone ?? existing.phone,
            meta: payload.meta ? payload.meta : existing.meta,
            status: existing.status,
          },
        });
      }
    }

    // create if not exist: prefer email, else phone route
    return this.prisma.lead.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        meta: payload.meta ? payload.meta : undefined,
      },
    });
  }
}
