import { IsOptional, IsString } from 'class-validator';

export class TrackDto {
  @IsString()
  type: string; // page_view, click, whatsapp_click, etc.

  @IsOptional()
  data?: any; // payload libre

  @IsOptional()
  leadEmail?: string; // para relacionar con lead si existe

  @IsOptional()
  leadPhone?: string;
}
