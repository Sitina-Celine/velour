// The offer: one lipstick, the Trio or the Full Collection.
// The visitor picks shades here; the server checks the choice again before charging.
import { useEffect, useState } from "react";
import { OFFERS, SHADES, NOTE_MAX } from "../data/offer.js";

const ORDER = ["single", "trio", "collection"];

export default function Builder({ picked }) {
  const [offerId, setOfferId] = useState("trio");
  const [selected, setSelected] = useState([SHADES[0].id]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cancelled] = useState(() => new URLSearchParams(location.search).get("checkout") === "cancelled");

  const offer = OFFERS[offerId];

  // "Try this shade" from the looks section adds the shade here too
  useEffect(() => {
    if (picked.n > 0) addShade(picked.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  // If the visitor comes back from Stripe with the back button, unlock the button
  useEffect(() => {
    const reset = () => setBusy(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  function addShade(id) {
    setError("");
    setSelected((cur) => {
      if (offer.pick === 1) return [id];
      if (cur.includes(id)) return cur;
      const next = [...cur, id];
      return next.length > offer.pick ? next.slice(next.length - offer.pick) : next;
    });
  }

  function toggleShade(id) {
    setError("");
    if (offer.pick === 1) return setSelected([id]);
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      const next = [...cur, id];
      return next.length > offer.pick ? next.slice(next.length - offer.pick) : next;
    });
  }

  function chooseOffer(id) {
    setError("");
    setOfferId(id);
    const pick = OFFERS[id].pick;
    if (pick > 0) setSelected((cur) => (cur.length ? cur.slice(0, pick) : [SHADES[0].id]));
  }

  const needed = offer.pick === 0 ? 0 : offer.pick - selected.length;
  const ready = needed === 0;

  async function checkout() {
    if (!ready) {
      setError(needed === 1 ? "Choose 1 more shade." : `Choose ${needed} more shades.`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer: offerId, shades: offer.pick ? selected : [], giftWrap, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout couldn't start. Please try again.");
      location.href = data.url;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <section id="build" className="section build" aria-labelledby="build-title">
      <figure className="build-media">
        <img src="/img/trio.jpg" alt="Three red lipsticks standing on a glossy red surface" loading="lazy" />
      </figure>

      <div className="build-panel">
        <p className="eyebrow">Build your trio</p>
        <h2 id="build-title" className="section-title">Pick your shades.</h2>
        {cancelled && <p className="notice">Your bag is still here. Pick up where you left off.</p>}

        <div className="offers" role="radiogroup" aria-label="Offer">
          {ORDER.map((id) => {
            const o = OFFERS[id];
            const on = id === offerId;
            return (
              <button key={id} type="button" role="radio" aria-checked={on} className={`offer${on ? " is-on" : ""}`} onClick={() => chooseOffer(id)}>
                {o.badge && <span className="offer-badge">{o.badge}</span>}
                <span className="offer-label">{o.label}</span>
                <span className="offer-blurb">{o.blurb}</span>
                <span className="offer-price">
                  ${o.price}
                  {o.was && <s>${o.was}</s>}
                </span>
              </button>
            );
          })}
        </div>

        {offer.pick > 0 ? (
          <div className="picker">
            <p className="picker-hint">
              {offer.pick === 1 ? "Your shade" : `Choose ${offer.pick} shades`}
              <span>{offer.pick > 1 && `${selected.length} of ${offer.pick}`}</span>
            </p>
            <div className="picker-grid">
              {SHADES.map((s) => {
                const on = selected.includes(s.id);
                return (
                  <button key={s.id} type="button" aria-pressed={on} className={`pick${on ? " is-on" : ""}`} style={{ "--c": s.color }} onClick={() => toggleShade(s.id)}>
                    <span className="pick-dot" />
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="picker-all">All six shades: {SHADES.map((s) => s.name).join(", ")}.</p>
        )}

        <label className="gift">
          <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} />
          <span>Free gift wrap with a handwritten note</span>
        </label>
        {giftWrap && (
          <input
            className="gift-note"
            type="text"
            maxLength={NOTE_MAX}
            placeholder="Your note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-label="Gift note"
          />
        )}

        <button type="button" className="btn btn-wide" onClick={checkout} disabled={busy}>
          {busy ? "Opening secure checkout..." : `Checkout, $${offer.price}`}
        </button>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="fine">Free US shipping. Secure payment by Stripe.</p>
      </div>
    </section>
  );
}
