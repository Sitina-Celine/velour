// Sample reviews, clearly labelled. A live store would connect a verified-review app.
const REVIEWS = [
  { text: "Put it on at 8am, still there after lunch and two coffees.", name: "Amara", shade: "Velvet Cherry" },
  { text: "The first matte that doesn't make my lips feel tight.", name: "Lena", shade: "Nude Silk" },
  { text: "Bought the trio for my sister. Now I need my own.", name: "Josie", shade: "Plum Noir" },
];

export default function Reviews() {
  return (
    <section className="section reviews" aria-labelledby="reviews-title">
      <figure className="reviews-media">
        <img src="/img/nude.jpg" alt="A hand holding an open nude lipstick" loading="lazy" />
      </figure>
      <div className="reviews-body">
        <p className="eyebrow">Sample reviews</p>
        <h2 id="reviews-title" className="section-title">Worn all day. Loved all day.</h2>
        <ul className="review-list">
          {REVIEWS.map((r) => (
            <li key={r.name} className="review">
              <p className="review-stars" aria-label="5 out of 5">★★★★★</p>
              <blockquote>{r.text}</blockquote>
              <p className="review-by">{r.name}, wears {r.shade}</p>
            </li>
          ))}
        </ul>
        <p className="fine">These are example reviews for a portfolio demo.</p>
      </div>
    </section>
  );
}
