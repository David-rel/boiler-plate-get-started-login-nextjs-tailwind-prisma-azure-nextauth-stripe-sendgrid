import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import { promises as fs } from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Stripe session retrieved:", session);

    // Check if the payment is successful
    if (session.payment_status === "paid" && session.metadata) {
      const {
        companyName,
        description,
        subscription,
        email,
        selectedAddons,
        totalPrice,
      } = session.metadata;

      // Ensure required metadata fields are present
      if (!companyName || !subscription || !email || !totalPrice) {
        throw new Error("Missing required metadata fields.");
      }

      // Check if the company already exists
      const existingCompany = await prisma.company.findUnique({
        where: { stripeCustomerId: session.customer as string },
      });

      let secretKey;
      if (existingCompany) {
        // Company already exists
        console.log("Company already exists:", existingCompany);
        secretKey = existingCompany.secretKey;
      } else {
        // Generate the secret key
        secretKey = await generateSecretKey();

        // Create company profile in the database
        const company = await prisma.company.create({
          data: {
            name: companyName,
            description: description ?? "",
            subscriptionType: subscription,
            subscriptionPrice: parseFloat(totalPrice),
            email: email,
            stripeCustomerId: session.customer as string,
            secretKey, // Store the generated secret key
            ...parseAddons(selectedAddons),
          },
        });
        console.log("Company profile created:", company);
      }

      return NextResponse.json({
        success: true,
        session,
        secretKey, // Include the secret key in the response
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Payment not successful or metadata missing.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(
      "Error fetching checkout session or creating company profile:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch checkout session or create company profile",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to generate the secret key from words.json
async function generateSecretKey() {
  try {
    const filePath = path.join(process.cwd(), "public", "words.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const wordsObject = JSON.parse(fileContent);
    const words = Object.keys(wordsObject);

    // Get 12 random words
    const randomWords = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      randomWords.push(words[randomIndex]);
    }

    return randomWords.join(" ");
  } catch (error) {
    console.error("Error generating secret key:", error);
    throw new Error("Error generating secret key.");
  }
}

// Helper function to parse selected addons
function parseAddons(selectedAddons: string) {
  if (!selectedAddons) return {};

  const addons = JSON.parse(selectedAddons);
  return {
    example1: addons.some(
      (addon: any) => addon.name === "example1"
    ),
    example2: addons.some(
      (addon: any) => addon.name === "example2"
    ),
    
  };
}
