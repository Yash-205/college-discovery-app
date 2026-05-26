import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { body } = await req.json();
    const { id: discussionId } = await params;

    if (!body) {
      return NextResponse.json({ message: 'Answer body is required' }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        body,
        discussionId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, email: true, avatar: true } }
      }
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating answer', error: error.message }, { status: 500 });
  }
}
