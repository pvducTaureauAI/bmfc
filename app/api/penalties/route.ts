import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// GET penalties
export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const today = searchParams.get("today");

    let where: any = {};

    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    } else if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const penalties = await prisma.penalty.findMany({
      where,
      include: { member: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(penalties);
  } catch (error) {
    console.error("Get penalties error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create penalty (Admin only)
export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { memberId, amount, reason, date } = await req.json();

    const penalty = await prisma.penalty.create({
      data: {
        memberId,
        amount,
        reason,
        date: date || new Date(),
      },
      include: { member: true },
    });

    return NextResponse.json(penalty, { status: 201 });
  } catch (error) {
    console.error("Create penalty error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
