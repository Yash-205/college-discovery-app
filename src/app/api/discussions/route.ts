import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get('collegeId');

    const whereClause = collegeId ? { collegeId } : {};

    const discussions = await prisma.discussion.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, email: true, avatar: true } },
        answers: { include: { author: { select: { id: true, email: true, avatar: true } } } },
        college: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(discussions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching discussions', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, body, collegeId } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ message: 'Title and body are required' }, { status: 400 });
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        body,
        authorId: userId,
        collegeId: collegeId || null
      },
      include: {
        author: { select: { id: true, email: true, avatar: true } }
      }
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating discussion', error: error.message }, { status: 500 });
  }
}
