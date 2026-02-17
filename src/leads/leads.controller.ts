import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateLeadDto } from '../dto/create-lead.dto.js';
import { LeadsService } from './leads.service.js';

@Controller('lead')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateLeadDto) {
    const lead = await this.leadsService.create(dto);
    return { ok: true, lead };
  }
}
