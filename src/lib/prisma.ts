import { PrismaClient } from '@prisma/client'

// Force clear cached PrismaClient to load new Discussion, Answer, and Name models
// Updated for user name & avatar schema migration
if (typeof globalThis !== 'undefined' && (globalThis as any).prismaGlobal) {
  delete (globalThis as any).prismaGlobal;
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
