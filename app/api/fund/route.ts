import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// GET total fund summary
export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if (!auth.authorized) return auth.response;

  try {
    // Tổng thu từ quỹ tháng (đã nộp)
    const monthlyFeesTotal = await prisma.monthlyFee.aggregate({
      where: { isPaid: true },
      _sum: { amount: true },
    });

    // Tổng thu từ phạt (đã nộp)
    const penaltiesTotal = await prisma.penalty.aggregate({
      where: { isPaid: true },
      _sum: { amount: true },
    });

    // Tổng chi
    const expensesTotal = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    const totalIncome =
      (monthlyFeesTotal._sum.amount?.toNumber() || 0) +
      (penaltiesTotal._sum.amount?.toNumber() || 0);

    const totalExpense = expensesTotal._sum.amount?.toNumber() || 0;
    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      totalIncome,
      monthlyFeesIncome: monthlyFeesTotal._sum.amount?.toNumber() || 0,
      penaltiesIncome: penaltiesTotal._sum.amount?.toNumber() || 0,
      totalExpense,
      balance,
    });
  } catch (error) {
    console.error("Get fund summary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
