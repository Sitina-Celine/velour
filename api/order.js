// GET /api/order?session_id=cs_...
// Reads the paid order from Stripe and returns a safe summary for the thank-you page.
// Nothing private (card numbers, keys) ever leaves the server.

import Stripe from "stripe";

const isValidSessionId = (id) => typeof id === "string" && /^cs_(test|live)_[A-Za-z0-9]+$/.test(id);
const dollars = (cents) => (cents || 0) / 100;

export function summarise(session) {
  const shipping = session.collected_information?.shipping_details || session.shipping_details || null;
  const a = shipping?.address || {};
  return {
    paid: session.payment_status === "paid",
    subscription: session.mode === "subscription",
    orderNumber: session.id.slice(-8).toUpperCase(),
    email: session.customer_details?.email || "",
    firstName: (shipping?.name || session.customer_details?.name || "").split(" ")[0],
    items: (session.line_items?.data || []).map((l) => ({ name: l.description, qty: l.quantity, total: dollars(l.amount_total) })),
    subtotal: dollars(session.amount_subtotal),
    discount: dollars(session.total_details?.amount_discount),
    total: dollars(session.amount_total),
    note: session.metadata?.note || "",
    address: shipping
      ? { name: shipping.name, line1: a.line1 || "", line2: a.line2 || "", city: a.city || "", state: a.state || "", postalCode: a.postal_code || "" }
      : null,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const id = req.query?.session_id;
  if (!isValidSessionId(id)) {
    res.status(400).json({ error: "We couldn't find that order." });
    return;
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(id, { expand: ["line_items"] });
    res.status(200).json(summarise(session));
  } catch (err) {
    console.error("Order lookup error:", err.message);
    const missing = err.code === "resource_missing";
    res.status(missing ? 404 : 500).json({ error: missing ? "We couldn't find that order." : "We couldn't load your order. Please refresh." });
  }
}
