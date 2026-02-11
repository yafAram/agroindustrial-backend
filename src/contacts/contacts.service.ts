import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContactDto) {
    return this.prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        meta: { message: data.message },
      },
    });
  }
}
