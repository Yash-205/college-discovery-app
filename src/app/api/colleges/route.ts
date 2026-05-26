import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const maxFee = searchParams.get('maxFee');
    const sortBy = searchParams.get('sortBy');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const whereClause: any = {};
    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }
    if (location) {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }
    if (maxFee) {
      whereClause.fees = { lte: parseInt(maxFee) };
    }

    let orderByClause: any = { createdAt: 'desc' };
    if (sortBy === 'rating') {
      orderByClause = { rating: 'desc' };
    } else if (sortBy === 'fees') {
      orderByClause = { fees: 'asc' };
    }

    const colleges = await prisma.college.findMany({
      where: whereClause,
      orderBy: orderByClause,
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
