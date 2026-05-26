import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json({ message: 'No college IDs provided for comparison' }, { status: 400 });
    }

    // Split by comma and clean up whitespace
    const ids = idsParam.split(',').map(id => id.trim()).filter(id => id.length > 0);

    if (ids.length < 2) {
      return NextResponse.json({ message: 'Please provide at least 2 college IDs to compare' }, { status: 400 });
    }

    if (ids.length > 4) {
      return NextResponse.json({ message: 'You can compare a maximum of 4 colleges at once' }, { status: 400 });
    }

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    
    return NextResponse.json(colleges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching colleges for comparison', error: error.message }, { status: 500 });
  }
}
