import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// PUT update monthly fee payment status (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const { isPaid, paidDate } = await req.json();

    const fee = await prisma.monthlyFee.update({
      where: { id },
      data: {
        isPaid,
        paidDate: isPaid ? paidDate || new Date() : null,
      },
      include: { member: true },
    });

    return NextResponse.json(fee);
  } catch (error) {
    console.error("Update monthly fee error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
