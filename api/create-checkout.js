// Creates the Stripe Checkout Session for the chosen offer and shades.
// POST /api/create-checkout  { offer, shades, giftWrap, note }
// Prices and shade names come from src/data/offer.js on the server, never from the browser.

import Stripe from "stripe";
import { OFFERS, SHADES, PRODUCT_NAME, NOTE_MAX, findShade } from "../src/data/offer.js";

export function buildCheckout(body) {
  const offer = OFFERS[body?.offer];
  if (!offer) return { error: "Choose an offer first." };

  // Collection always includes all six; otherwise the customer must pick the right number of different shades
  let shades;
  if (offer.pick === 0) {
    shades = SHADES;
  } else {
    const ids = Array.isArray(body?.shades) ? [...new Set(body.shades)] : [];
    shades = ids.map(findShade).filter(Boolean);
    if (shades.length !== offer.pick) {
      return { error: offer.pick === 1 ? "Choose your shade." : `Choose ${offer.pick} different shades.` };
    }
  }

  const giftWrap = body?.giftWrap === true;
  const note = giftWrap && typeof body?.note === "string" ? body.note.replace(/\s+/g, " ").trim().slice(0, NOTE_MAX) : "";

  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: offer.price * 100,
        product_data: {
          name: offer.pick === 1 ? `${PRODUCT_NAME}, ${shades[0].name}` : `${PRODUCT_NAME}, ${offer.label}`,
          description: shades.map((s) => s.name).join(", "),
        },
      },
    },
  ];

  let summary = "";
  if (giftWrap) summary = note ? `Gift wrapped, with your note: "${note}"` : "Gift wrapped, no note.";

  return {
    offer,
    shades,
    lineItems,
    metadata: {
      offer: offer.id,
      shades: shades.map((s) => s.id).join(",").slice(0, 400),
      giftWrap: giftWrap ? "yes" : "no",
      note: summary.slice(0, 450),
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const order = buildCheckout(req.body);
  if (order.error) {
    res.status(400).json({ error: order.error });
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const origin = `${protocol}://${req.headers.host}`;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      adaptive_pricing: { enabled: false },
      allowed_payment_method_types: ["card"],
      line_items: order.lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Free standard shipping",
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 5 } },
          },
        },
      ],
      metadata: order.metadata,
      success_url: `${origin}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled#build`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: "Checkout couldn't start. Please try again." });
  }
}
