import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { TrackDto } from './dto/track.dto.js';
import { IdentifyDto } from './dto/identify.dto.js';
import { AnalyticsService } from './analytics.service.js';

@Controller()
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Post('track')
  @HttpCode(HttpStatus.CREATED)
  async track(@Body() dto: TrackDto) {
    const ev = await this.analytics.track(dto as any);
    return { ok: true, event: ev };
  }

  @Post('identify')
  @HttpCode(HttpStatus.OK)
  async identify(@Body() dto: IdentifyDto) {
    const lead = await this.analytics.identify(dto as any);
    return { ok: true, lead };
  }
}
