// src/env.d.ts
/// <reference types="astro/client" />

// Tipos para el contexto local (ctx.locals)
declare namespace App {
  interface Locals {
    user?: {
      userId: string;
      email: string;
      role?: string;
      exp?: number;
      iat?: number;
      [key: string]: any;
    };
  }
}

// Variables de entorno
interface ImportMetaEnv {
  readonly JWT_SECRET: string;
  readonly SESSION_EXPIRY_DAYS?: string;
  // Agrega más variables aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}