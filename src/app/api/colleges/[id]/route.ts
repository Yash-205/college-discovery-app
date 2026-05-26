import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        discussions: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
            answers: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error fetching college",
        error: error.message,
      },
      { status: 500 }
    );
  }
}