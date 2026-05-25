import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || 'fallback_secret';
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '7d' });

    return NextResponse.json({ message: 'Login successful', token, userId: user.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
  }
}
