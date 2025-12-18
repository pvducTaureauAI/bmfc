import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";

// POST - Bulk create monthly fees for all active members (Admin only)
export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { month, year, amount } = await req.json();

    if (!month || !year || !amount) {
      return NextResponse.json(
        { error: "Month, year, and amount are required" },
        { status: 400 }
      );
    }

    // Get all active members
    const activeMembers = await prisma.member.findMany({
      where: {
        status: "ACTIVE",
      },
    });

    if (activeMembers.length === 0) {
      return NextResponse.json(
        { error: "No active members found" },
        { status: 404 }
      );
    }

    // Check if fees already exist for this month/year
    const existingFees = await prisma.monthlyFee.findMany({
      where: {
        month: parseInt(month),
        year: parseInt(year),
      },
      select: {
        memberId: true,
      },
    });

    const existingMemberIds = new Set(existingFees.map((f: any) => f.memberId));

    // Filter out members who already have fees for this month/year
    const membersToCreate = activeMembers.filter(
      (member: any) => !existingMemberIds.has(member.id)
    );

    if (membersToCreate.length === 0) {
      return NextResponse.json(
        {
          message: "All active members already have fees for this month/year",
          skipped: activeMembers.length,
          created: 0,
        },
        { status: 200 }
      );
    }

    // Bulk create monthly fees
    const feesData = membersToCreate.map((member: any) => ({
      memberId: member.id,
      month: parseInt(month),
      year: parseInt(year),
      amount: parseFloat(amount),
      isPaid: false,
    }));

    const result = await prisma.monthlyFee.createMany({
      data: feesData,
    });

    return NextResponse.json(
      {
        message: "Monthly fees created successfully",
        created: result.count,
        skipped: existingFees.length,
        total: activeMembers.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk create monthly fees error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
