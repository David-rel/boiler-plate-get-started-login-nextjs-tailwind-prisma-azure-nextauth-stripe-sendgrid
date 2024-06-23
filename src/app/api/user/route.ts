// pages/api/user.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      password,
      profileImage,
      display,
      role,
      companyId,
      deviceInfo, // Device information from the client
    } = await request.json();

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create user in the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        profileImage,
        display,
        role,
        companyId,
        verificationCode,
      },
    });

    // Store device information
    await prisma.verifiedDevice.create({
      data: {
        deviceId: deviceInfo,
        userId: newUser.id,
      },
    });

    // Send an email using SendGrid
    const emailContent = {
      to: email,
      from: "example.com",
      subject: "Your Verification Code",
      text: `Your 6-digit verification code is: ${verificationCode}`,
      html: `<p>Your 6-digit verification code is: <strong>${verificationCode}</strong></p>`,
    };

    await sgMail.send(emailContent);

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error("Error creating user or sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to create user or send verification email" },
      { status: 500 }
    );
  }
}
