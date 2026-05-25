import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const college = await prisma.college.findUnique({
      where: { id: params.id }
    });
    
    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }
    
    return NextResponse.json(college, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching college', error: error.message }, { status: 500 });
  }
}
