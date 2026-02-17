import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationsService {

  async handleNewContact(contact: any) {

    console.log('Lead listo para integraciones:', contact.id);

    // FUTURO:
    // await this.sendToGoogle(contact);
    // await this.sendToMeta(contact);
  }

  async dispatch(payload: {
  lead: any;
  event: string;
}) {
  // Aquí luego irá Meta, Google, Webhooks, etc.
  console.log('Dispatching integration:', payload);

  return true;
}


  async sendToGoogle(contact: any) {
    // Aquí irá la lógica futura
  }

  async sendToMeta(contact: any) {
    // Aquí irá la lógica futura
  }
}
