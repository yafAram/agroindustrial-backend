import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLeadDto } from '../dto/create-lead.dto.js';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

async upsert(dto: any) {
  const existing = await this.prisma.lead.findFirst({
    where: {
      OR: [
        { email: dto.email },
        { phone: dto.phone },
      ],
    },
  });

  if (existing) {
    return this.prisma.lead.update({
      where: { id: existing.id },
      data: {
        name: dto.name ?? existing.name,
        email: dto.email ?? existing.email,
        phone: dto.phone ?? existing.phone,
        source: dto.source ?? existing.source,
        utm_source: dto.utm_source,
        utm_medium: dto.utm_medium,
        utm_campaign: dto.utm_campaign,
      },
    });
  }

  return this.prisma.lead.create({
    data: {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      source: dto.source,
      utm_source: dto.utm_source,
      utm_medium: dto.utm_medium,
      utm_campaign: dto.utm_campaign,
    },
  });
}



  async create(dto: CreateLeadDto) {
    // Guardar lead, si email único y ya existe, actualiza
    if (dto.email) {
      const existing = await this.prisma.lead.findUnique({ where: { email: dto.email } });
      if (existing) {
        // actualizamos algunos campos
        return this.prisma.lead.update({
          where: { id: existing.id },
          data: {
            ...dto,
            meta: dto.meta ?? existing.meta,
          },
        });
      }
    }

    return this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
        meta: dto.meta ? dto.meta : undefined,
        utm_source: (dto as any).utm_source,
        utm_medium: (dto as any).utm_medium,
        utm_campaign: (dto as any).utm_campaign,
        utm_term: (dto as any).utm_term,
        utm_content: (dto as any).utm_content,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.lead.findUnique({ where: { id } });
  }
}
