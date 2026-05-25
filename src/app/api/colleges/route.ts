import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const colleges = await prisma.college.findMany({
      where: search ? {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      } : undefined,
      take: limit,
    });
    
    return NextResponse.json(colleges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching colleges', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const college = await prisma.college.create({ data });
    return NextResponse.json(college, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating college', error: error.message }, { status: 500 });
  }
}
