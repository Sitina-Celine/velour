// One shade, three looks. Each card suggests a shade and can send it to the builder.
import { findShade } from "../data/offer.js";

const LOOKS = [
  { id: "day", title: "Daytime", text: "Soft, warm and easy.", shade: "brick-rouge", img: "/img/day.jpg", alt: "Woman with long brown hair outdoors wearing a warm brick-red lip" },
  { id: "office", title: "Office", text: "Crisp and confident.", shade: "velvet-cherry", img: "/img/office.jpg", alt: "Woman in a white top wearing a classic red lip" },
  { id: "evening", title: "Evening", text: "Deep and glossy-dark.", shade: "plum-noir", img: "/img/evening.jpg", alt: "Woman with curly hair wearing a deep plum lip against a dark background" },
];

export default function Looks({ onTry }) {
  return (
    <section id="looks" className="section looks" aria-labelledby="looks-title">
      <div className="section-head">
        <p className="eyebrow">One lipstick, three moods</p>
        <h2 id="looks-title" className="section-title">One shade for every part of your day.</h2>
      </div>
      <div className="looks-grid">
        {LOOKS.map((look) => {
          const shade = findShade(look.shade);
          return (
            <article key={look.id} className="look">
              <img src={look.img} alt={look.alt} loading="lazy" />
              <div className="look-body">
                <div>
                  <h3>{look.title}</h3>
                  <p>{look.text} Wearing <strong>{shade.name}</strong>.</p>
                </div>
                <button type="button" className="look-try" style={{ "--c": shade.color }} onClick={() => onTry(shade.id)}>
                  <span className="look-dot" />
                  Try this shade
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
