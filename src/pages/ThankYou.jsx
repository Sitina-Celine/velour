// Thank-you page. Reads the paid order from Stripe through /api/order.
import { useEffect, useState } from "react";
import { BRAND } from "../data/brand.js";

const money = (n) => `$${n.toFixed(2)}`;

export default function ThankYou() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("session_id");
    if (!id) {
      setError("We couldn't find that order.");
      return;
    }
    fetch(`/api/order?session_id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "We couldn't load your order. Please refresh.");
        setOrder(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="ty">
      <a className="ty-brand" href="/">{BRAND.name}</a>

      {error && (
        <section className="ty-card">
          <h1 className="ty-title">Something went wrong</h1>
          <p className="ty-muted">{error}</p>
          <a className="ty-link" href="/">Back to the shop</a>
        </section>
      )}

      {!error && !order && <p className="ty-muted ty-loading">Loading your order...</p>}

      {order && (
        <section className="ty-card">
          <span className="ty-tick" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <h1 className="ty-title">
            {order.paid ? BRAND.thanksTitle(order.firstName) : "Your order is being confirmed"}
          </h1>
          <p className="ty-muted">
            Order {order.orderNumber}
            {order.email && `. A receipt is on its way to ${order.email}.`}
          </p>

          <ul className="ty-items">
            {order.items.map((item, i) => (
              <li key={i}>
                <span>{item.qty > 1 ? `${item.qty} x ` : ""}{item.name}</span>
                <span>{item.total === 0 ? "Free" : money(item.total)}</span>
              </li>
            ))}
            {order.discount > 0 && (
              <li className="ty-discount"><span>Discount</span><span>-{money(order.discount)}</span></li>
            )}
            <li className="ty-total">
              <span>{order.subscription ? "Paid today" : "Total paid"}</span>
              <span>{money(order.total)}</span>
            </li>
          </ul>

          {order.note && <p className="ty-note">{order.note}</p>}

          {order.address && (
            <div className="ty-ship">
              <h2>Shipping to</h2>
              <p>
                {order.address.name}<br />
                {order.address.line1}{order.address.line2 && <>, {order.address.line2}</>}<br />
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </p>
            </div>
          )}

          <div className="ty-next">
            <h2>What happens next</h2>
            <ol>
              {BRAND.nextSteps(order).map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>

          <a className="ty-button" href="/">{BRAND.backLabel}</a>
        </section>
      )}

      <p className="ty-foot">{BRAND.name} is a fictional brand made for a portfolio by Celine Sitina.</p>
    </main>
  );
}
