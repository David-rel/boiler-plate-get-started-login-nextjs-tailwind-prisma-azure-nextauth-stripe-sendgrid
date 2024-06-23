// src/app/api/create-company/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeCustomer } from "../../../utils/stripe";
import { ADDONS } from "@/lib/constants";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const {
      companyName,
      description,
      subscription,
      email,
      selectedAddons,
      totalPrice,
    } = await req.json();

    if (!["STARTER", "BUSINESS", "ENTREPRENEURIAL"].includes(subscription)) {
      return NextResponse.json(
        { error: "Invalid subscription type" },
        { status: 400 }
      );
    }

    // Create Stripe customer
    const stripeCustomer = await createStripeCustomer(email);

    // Prepare add-on details for description
    const addOnDetails =
      selectedAddons.length > 0
        ? selectedAddons
            .map(
              (addon: { name: string; price: number }) =>
                `- ${addon.name} ($${addon.price})`
            )
            .join("\n")
        : "No additional add-ons";

    // Create a product if add-ons are selected
    let priceId;
    if (selectedAddons.length > 0) {
      // Create a new product in Stripe
      const product = await stripe.products.create({
        name: `${subscription} Subscription with Add-ons`,
        description: `Includes the following add-ons:\n${addOnDetails}`,
        images: [`https://example.com/example.png`], // Add photo URL
      });

      // Create a custom price for the product
      const price = await stripe.prices.create({
        unit_amount: Math.round(totalPrice * 100), // total price in cents
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id, // Link to the product
      });
      priceId = price.id;
    } else {
      // Use predefined price ID
      priceId = getPriceId(subscription);
    }

    // Log the price ID
    console.log(
      `Creating session for subscription type: ${subscription} with price ID: ${priceId}`
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/get-started/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/get-started`,
      metadata: {
        companyName,
        description,
        subscription,
        email,
        selectedAddons: JSON.stringify(selectedAddons), // Serialize addons array
        totalPrice: totalPrice.toString(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}

function getPriceId(subscription: string) {
  switch (subscription) {
    case "STARTER":
      return process.env.STRIPE_PRICE_ID_STARTER!;
    case "BUSINESS":
      return process.env.STRIPE_PRICE_ID_BUSINESS!;
    case "ENTREPRENEURIAL":
      return process.env.STRIPE_PRICE_ID_ENTREPRENEURIAL!;
    default:
      throw new Error("Invalid subscription type");
  }
}
