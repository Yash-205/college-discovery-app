import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

function verifyAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret';
  return jwt.verify(token, secret) as { userId: string, email: string };
}

export async function GET(req: Request) {
  try {
    const decoded = verifyAuth(req);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { savedColleges: true }
    });

    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json(user.savedColleges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = verifyAuth(req);
    const { collegeId, action } = await req.json(); // action: 'save' or 'remove'

    if (action === 'save') {
      const user = await prisma.user.update({
        where: { id: decoded.userId },
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
        where: { id: decoded.userId },
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
