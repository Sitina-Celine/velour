# VELOUR: a lipstick sales page with a shade builder

**Colour that stays.**

A one-product sales page for a velvet matte lipstick. The visitor tries shades live, sees each shade on three looks, then builds a single, a Trio or the Full Collection and pays through Stripe Checkout.

VELOUR is a fictional brand created for a portfolio demo. Author: Celine Sitina.

## The funnel

```
Ad or social post
  -> Sales page        try shades in the hero, see three looks
  -> Build your trio   One ($32), Trio ($78, usually $96), Full Collection ($139, usually $192)
                       free gift wrap with an optional note
  -> Stripe Checkout   free US shipping
  -> Thank-you page    order read back from Stripe
```

| Section | Job it does |
|---|---|
| Hero | The headline's last word and the page tint change with the shade ("Colour that stays / lingers / commands"). Trust points under the button. |
| Three looks | Daytime, office, evening. Each card has "Try this shade", which also adds that shade to the order box. |
| Build your trio | The offer. The Trio is preselected and marked Most popular, because it raises the average order from $32 to $78. |
| Sample reviews | Short quotes, clearly labelled as samples. |

## Design decisions

- **Interaction sells the product.** Shade is the hardest thing to judge online, so the first thing a visitor can do is click through shades and watch the page change.
- **Anchored pricing.** The single at $32 makes the Trio at $78 (save $18) feel like the sensible choice; the collection anchors the top.
- **Short page.** Four sections, each about one screen. On phones the looks become a swipe row so the page stays short.
- **Server-side truth.** Prices and shade names live in `src/data/offer.js`. The server reads that file again and checks the shades (right count, all different, real shade names) before it creates the Stripe session.
- **Honest social proof.** Reviews are labelled as samples. A live store would connect a verified-review app.

## Tech stack

| Part | Choice |
|---|---|
| Interface | React 19 and Vite, two pages (`index.html`, `thank-you.html`) |
| Payments | Stripe Checkout (prices built on the server with `price_data`) |
| Server code | Vercel serverless functions in `/api` |
| Hosting | Vercel |

## Project structure

```
api/
  create-checkout.js   checks the offer and shades, creates the Stripe session
  order.js             reads the paid order for the thank-you page
  health.js            shows whether the Stripe key is loaded (never shows the key)
src/
  data/offer.js        shades, offers and prices (used by page and server)
  data/brand.js        text for the thank-you page
  components/          Header, Hero, Looks, Builder, Reviews, Footer
  pages/ThankYou.jsx
  styles/              base.css, page.css, thank-you.css
public/img/            photos from Unsplash
```

## Run it locally

1. Install Node.js 20 or newer.
2. `npm install`
3. Copy `.env.example` to `.env.local` and add your Stripe **test** secret key.
4. `npm run dev` and open http://localhost:5173
5. Pay with the Stripe test card `4242 4242 4242 4242`, any future date, any CVC.

Check the key is loaded at http://localhost:5173/api/health.

## Deploy to Vercel

1. Push the project to GitHub (`.env.local` is ignored by git).
2. Import the repository in Vercel. Framework preset: Vite.
3. Add `STRIPE_SECRET_KEY` under Settings, Environment Variables, then deploy.

## Credits

Photos from Unsplash: Qasim Malick, Hichem Dahmani, Nick Arnot, Carla Vilanculo, Mehmet Ali Turan, Anita Austvika.
