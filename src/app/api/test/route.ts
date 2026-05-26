import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Attempt to connect and query PostgreSQL via Prisma
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { message: 'Backend API is running and successfully connected to PostgreSQL via Prisma!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { message: 'Backend API is running, but failed to connect to PostgreSQL.', error: error.message },
      { status: 500 }
    );
  }
}
