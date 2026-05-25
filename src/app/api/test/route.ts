import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Attempt to connect to the database
    await dbConnect();
    
    return NextResponse.json(
      { message: 'Backend API is running and successfully connected to MongoDB!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { message: 'Backend API is running, but failed to connect to MongoDB.', error: error.message },
      { status: 500 }
    );
  }
}
