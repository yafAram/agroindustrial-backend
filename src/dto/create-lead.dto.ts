import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() meta?: any;
  @IsOptional() @IsString() utm_source?: string;
  @IsOptional() @IsString() utm_medium?: string;
  @IsOptional() @IsString() utm_campaign?: string;
  @IsOptional() @IsString() utm_term?: string;
  @IsOptional() @IsString() utm_content?: string;
}
