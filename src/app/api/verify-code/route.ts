import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Find user by email and verification code
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        verificationCode: code,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    // Update user to mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: null, emailVerify: true },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
