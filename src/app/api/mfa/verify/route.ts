// app/api/mfa/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { mfaCode, deviceInfo } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        verificationCode: mfaCode,
      },
    });

    if (user && user.verificationCode === mfaCode) {
      // Clear the verification code
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode: null,
        },
      });

      // Add the new device to verified devices
      await prisma.verifiedDevice.create({
        data: {
          deviceId: deviceInfo,
          userId: user.id,
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying MFA:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
