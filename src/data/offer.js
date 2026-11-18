// Single source of truth for shades and prices.
// The page reads this file to show prices, and the server reads it again to charge,
// so a visitor can't change a price in the browser.

export const PRODUCT_NAME = "VELOUR Velvet Matte Lipstick";

export const SHADES = [
  { id: "velvet-cherry", name: "Velvet Cherry", color: "#9E1B32", soft: "#F2D9DB", word: "stays." },
  { id: "rosewood", name: "Rosewood", color: "#A4505B", soft: "#F3DEE0", word: "lingers." },
  { id: "nude-silk", name: "Nude Silk", color: "#C08A7A", soft: "#F6E6DF", word: "whispers." },
  { id: "coral-kiss", name: "Coral Kiss", color: "#E0604F", soft: "#FBDDD5", word: "glows." },
  { id: "plum-noir", name: "Plum Noir", color: "#5A1F3A", soft: "#E8D6DF", word: "commands." },
  { id: "brick-rouge", name: "Brick Rouge", color: "#9A3B26", soft: "#F2DDD4", word: "burns." },
];

export const SINGLE_PRICE = 32;

// pick = how many shades the customer chooses (0 means all six are included)
export const OFFERS = {
  single: { id: "single", label: "One lipstick", pick: 1, price: 32, was: null, blurb: "Your one signature shade." },
  trio: { id: "trio", label: "The Trio", pick: 3, price: 78, was: 96, blurb: "Day, office and evening, covered.", badge: "Most popular" },
  collection: { id: "collection", label: "Full Collection", pick: 0, price: 139, was: 192, blurb: "All six shades in a keepsake box." },
};

export const NOTE_MAX = 120;

export const findShade = (id) => SHADES.find((s) => s.id === id);
