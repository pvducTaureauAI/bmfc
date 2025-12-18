import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET debts summary (Public - no auth required)
export async function GET(req: NextRequest) {
  try {
    // Get all unpaid monthly fees with member info
    const unpaidMonthlyFees = await prisma.monthlyFee.findMany({
      where: {
        isPaid: false,
      },
      include: {
        member: true,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    // Get all unpaid penalties with member info
    const unpaidPenalties = await prisma.penalty.findMany({
      where: {
        isPaid: false,
      },
      include: {
        member: true,
      },
      orderBy: { date: "desc" },
    });

    // Group debts by member
    const debtsByMember: Record<
      number,
      {
        memberId: number;
        memberName: string;
        monthlyFeesDebt: number;
        penaltiesDebt: number;
        totalDebt: number;
        unpaidMonthlyFees: Array<{
          id: number;
          month: number;
          year: number;
          amount: number;
        }>;
        unpaidPenalties: Array<{
          id: number;
          date: string;
          amount: number;
          reason: string;
        }>;
      }
    > = {};

    // Process monthly fees
    unpaidMonthlyFees.forEach((fee: any) => {
      if (!debtsByMember[fee.memberId]) {
        debtsByMember[fee.memberId] = {
          memberId: fee.memberId,
          memberName: fee.member.name,
          monthlyFeesDebt: 0,
          penaltiesDebt: 0,
          totalDebt: 0,
          unpaidMonthlyFees: [],
          unpaidPenalties: [],
        };
      }
      const amount = fee.amount.toNumber();
      debtsByMember[fee.memberId].monthlyFeesDebt += amount;
      debtsByMember[fee.memberId].totalDebt += amount;
      debtsByMember[fee.memberId].unpaidMonthlyFees.push({
        id: fee.id,
        month: fee.month,
        year: fee.year,
        amount: amount,
      });
    });

    // Process penalties
    unpaidPenalties.forEach((penalty: any) => {
      if (!debtsByMember[penalty.memberId]) {
        debtsByMember[penalty.memberId] = {
          memberId: penalty.memberId,
          memberName: penalty.member.name,
          monthlyFeesDebt: 0,
          penaltiesDebt: 0,
          totalDebt: 0,
          unpaidMonthlyFees: [],
          unpaidPenalties: [],
        };
      }
      const amount = penalty.amount.toNumber();
      debtsByMember[penalty.memberId].penaltiesDebt += amount;
      debtsByMember[penalty.memberId].totalDebt += amount;
      debtsByMember[penalty.memberId].unpaidPenalties.push({
        id: penalty.id,
        date: penalty.date.toISOString(),
        amount: amount,
        reason: penalty.reason,
      });
    });

    // Convert to array and sort by total debt
    const debts = Object.values(debtsByMember).sort(
      (a, b) => b.totalDebt - a.totalDebt
    );

    // Calculate totals
    const summary = {
      totalMonthlyFeesDebt: debts.reduce(
        (sum, d) => sum + d.monthlyFeesDebt,
        0
      ),
      totalPenaltiesDebt: debts.reduce((sum, d) => sum + d.penaltiesDebt, 0),
      totalDebt: debts.reduce((sum, d) => sum + d.totalDebt, 0),
      totalMembers: debts.length,
    };

    return NextResponse.json({
      summary,
      debts,
    });
  } catch (error) {
    console.error("Get debts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
