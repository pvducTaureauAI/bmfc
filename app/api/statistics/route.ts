import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// GET statistics with date range
export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: "From and to dates are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    // Thu từ quỹ tháng
    const monthlyFeesIncome = await prisma.monthlyFee.aggregate({
      where: {
        isPaid: true,
        paidDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
    });

    // Thu từ phạt
    const penaltiesIncome = await prisma.penalty.aggregate({
      where: {
        isPaid: true,
        paidDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
    });

    // Chi
    const expensesTotal = await prisma.expense.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
    });

    // Chi tiết giao dịch
    const monthlyFees = await prisma.monthlyFee.findMany({
      where: {
        isPaid: true,
        paidDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { member: true },
      orderBy: { paidDate: "desc" },
    });

    const penalties = await prisma.penalty.findMany({
      where: {
        isPaid: true,
        paidDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { member: true },
      orderBy: { paidDate: "desc" },
    });

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "desc" },
    });

    const totalIncome =
      (monthlyFeesIncome._sum.amount?.toNumber() || 0) +
      (penaltiesIncome._sum.amount?.toNumber() || 0);

    const totalExpense = expensesTotal._sum.amount?.toNumber() || 0;
    const balance = totalIncome - totalExpense;

    return NextResponse.json({
      summary: {
        totalIncome,
        monthlyFeesIncome: monthlyFeesIncome._sum.amount?.toNumber() || 0,
        penaltiesIncome: penaltiesIncome._sum.amount?.toNumber() || 0,
        totalExpense,
        balance,
      },
      details: {
        monthlyFees,
        penalties,
        expenses,
      },
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
