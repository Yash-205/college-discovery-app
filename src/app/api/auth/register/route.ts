import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // Reloaded route to pick up schema updates
    const { email, password, name, avatar } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        avatar: avatar || null,
      }
    });

    return NextResponse.json({ message: 'User registered successfully', userId: newUser.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
  }
}
