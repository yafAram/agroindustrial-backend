import { Body, Controller, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private service: ContactsService) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }
}
