import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// GET monthly fees (Public - no auth required)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: any = {};
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);

    const fees = await prisma.monthlyFee.findMany({
      where,
      include: { member: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error("Get monthly fees error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create monthly fee (Admin only)
export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { memberId, month, year, amount } = await req.json();

    const fee = await prisma.monthlyFee.create({
      data: {
        memberId,
        month,
        year,
        amount,
      },
      include: { member: true },
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error("Create monthly fee error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
