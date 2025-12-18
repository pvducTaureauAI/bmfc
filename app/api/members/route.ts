import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// GET all members
export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if (!auth.authorized) return auth.response;

  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new member (Admin only)
export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { name, phone, email } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const member = await prisma.member.create({
      data: { name, phone, email },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Create member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
