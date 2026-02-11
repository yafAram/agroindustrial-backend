// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
// IMPORT con .js para ESM (asegúrate que prisma generate creó src/generated/client.js)
import { PrismaClient as GeneratedPrismaClient } from '../generated/client.js';

// adapter opcional (si lo instalaste)
let PrismaPg: any = undefined;
try {
  // require para evitar errores de tiempo de compilación si no está instalado
  PrismaPg = require('@prisma/adapter-pg').PrismaPg;
} catch (e) {
  PrismaPg = undefined;
}

@Injectable()
export class PrismaService extends (GeneratedPrismaClient as any) implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Construir opciones para Prisma 7: preferimos pasar adapter si está disponible
    let opts: any = {};

    try {
      if (PrismaPg && process.env.DATABASE_URL) {
        const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
        opts = { adapter };
      } else {
        opts = {} as any;
      }
    } catch (err) {
      // fallback: no interrumpir arranque
      opts = {} as any;
      // console.warn('No se pudo inicializar Prisma adapter, usando fallback', err);
    }

    super(opts);
  }

  async onModuleInit() {
    // Llamada segura a connect (compatibilidad con distintas versiones/engines)
    if (typeof (this as any).$connect === 'function') {
      await (this as any).$connect();
      return;
    }
    if (typeof (this as any).connect === 'function') {
      await (this as any).connect();
      return;
    }
  }

  async onModuleDestroy() {
    // Llamada segura a disconnect (compatibilidad)
    if (typeof (this as any).$disconnect === 'function') {
      await (this as any).$disconnect();
      return;
    }
    if (typeof (this as any).disconnect === 'function') {
      await (this as any).disconnect();
      return;
    }
  }

  // NO usar this.$on('beforeExit', ...) aquí: el client engine de Prisma 7 no lo soporta.
  // En su lugar registramos listeners en process para cualquier engine.
  enableShutdownHooks(app: INestApplication) {
    const shutdown = async () => {
      try {
        await app.close();
      } catch (e) {
        // ignore
      }
    };

    // escuchar las señales habituales (SIGINT/SIGTERM) y beforeExit
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
    process.once('beforeExit', shutdown);
  }
}
