// src/app/api/business/[customerId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  const { customerId } = params;

  if (!customerId) {
    return NextResponse.json({ error: "Missing customer_id" }, { status: 400 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { stripeCustomerId: customerId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 }
    );
  }
}
