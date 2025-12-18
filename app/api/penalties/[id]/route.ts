import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// PUT update penalty payment status (Admin only)
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

    const penalty = await prisma.penalty.update({
      where: { id },
      data: {
        isPaid,
        paidDate: isPaid ? paidDate || new Date() : null,
      },
      include: { member: true },
    });

    return NextResponse.json(penalty);
  } catch (error) {
    console.error("Update penalty error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE penalty (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    await prisma.penalty.delete({ where: { id } });
    return NextResponse.json({ message: "Penalty deleted successfully" });
  } catch (error) {
    console.error("Delete penalty error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
