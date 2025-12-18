import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// PUT update member (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const { name, phone, email, status } = await req.json();

    const member = await prisma.member.update({
      where: { id },
      data: { name, phone, email, status },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Update member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE member (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
