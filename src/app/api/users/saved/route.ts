import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { savedColleges: true }
    });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json(user.savedColleges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching saved colleges', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { collegeId, action } = await req.json(); // action: 'save' or 'remove'

    if (action === 'save') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          savedColleges: {
            connect: { id: collegeId }
          }
        },
        include: { savedColleges: true }
      });
      return NextResponse.json({ message: `College saved successfully`, savedColleges: user.savedColleges }, { status: 200 });
    } else if (action === 'remove') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          savedColleges: {
            disconnect: { id: collegeId }
          }
        },
        include: { savedColleges: true }
      });
      return NextResponse.json({ message: `College removed successfully`, savedColleges: user.savedColleges }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating saved colleges', error: error.message }, { status: 500 });
  }
}
