import { Controller, Post, Body, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { Request } from 'express';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(
    @Body() dto: CreateContactDto,
    @Req() req: Request,
  ) {
    return this.contactsService.handleContact({
      ...dto,
      ip: req.ip,
      user_agent: req.headers['user-agent'],
    });
  }
}
