import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// GET expenses (Public - no auth required)
export async function GET(req: NextRequest) {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create expense (Admin only)
export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { amount, reason, date } = await req.json();

    if (!amount || !reason) {
      return NextResponse.json(
        { error: "Amount and reason are required" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        amount,
        reason,
        date: date || new Date(),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
