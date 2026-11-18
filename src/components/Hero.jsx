// Hero: the headline's last word and the page tint change with the shade
import { SHADES, SINGLE_PRICE } from "../data/offer.js";

export default function Hero({ shade, onShade }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Velvet matte lipstick</p>
        <h1 id="hero-title" className="hero-title">
          Colour that <em key={shade.id} className="hero-word">{shade.word}</em>
        </h1>
        <p className="hero-sub">
          A weightless matte that feels like nothing and lasts 12 hours. Made with shea butter, so lips stay soft, not dry.
        </p>

        <div className="swatches" role="radiogroup" aria-label="Shade">
          {SHADES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={s.id === shade.id}
              aria-label={s.name}
              className={`swatch${s.id === shade.id ? " is-on" : ""}`}
              style={{ "--c": s.color }}
              onClick={() => onShade(s.id)}
            />
          ))}
        </div>
        <p className="shade-name">{shade.name}</p>

        <div className="hero-cta">
          <a className="btn" href="#build">Build your trio</a>
          <span className="hero-price">From ${SINGLE_PRICE}</span>
        </div>

        <ul className="trust">
          <li>12-hour wear</li>
          <li>Vegan and cruelty-free</li>
          <li>Free shade swap in 30 days</li>
        </ul>
      </div>

      <figure className="hero-media">
        <img src="/img/hero.jpg" alt="An open red lipstick standing on a red background" fetchPriority="high" />
        <figcaption className="hero-tag" style={{ "--c": shade.color }}>
          <span className="hero-tag-dot" />
          {shade.name}
        </figcaption>
      </figure>
    </section>
  );
}
