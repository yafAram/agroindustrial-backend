import { IsString, IsOptional, IsEmail, IsObject } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional() @IsString()
  source?: string;

  @IsOptional() @IsString()
  utm_source?: string;

  @IsOptional() @IsString()
  utm_medium?: string;

  @IsOptional() @IsString()
  utm_campaign?: string;

  @IsOptional() @IsString()
  utm_term?: string;

  @IsOptional() @IsString()
  utm_content?: string;

  @IsOptional() @IsString()
  referrer?: string;

  @IsOptional() @IsObject()
  meta?: any;
}
