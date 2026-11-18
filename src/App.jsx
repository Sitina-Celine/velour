// VELOUR sales page: hero with live shade switching, trust bar, three looks,
// the trio builder (the offer), sample reviews and footer.
import { useEffect, useState } from "react";
import { SHADES } from "./data/offer.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Looks from "./components/Looks.jsx";
import Builder from "./components/Builder.jsx";
import Reviews from "./components/Reviews.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [shadeId, setShadeId] = useState(SHADES[0].id);
  // The builder listens for this so "Try this shade" also picks it in the order box
  const [picked, setPicked] = useState({ id: SHADES[0].id, n: 0 });

  const shade = SHADES.find((s) => s.id === shadeId);

  // Tint the whole page softly with the current shade
  useEffect(() => {
    document.documentElement.style.setProperty("--shade", shade.color);
    document.documentElement.style.setProperty("--shade-soft", shade.soft);
  }, [shade]);

  const chooseShade = (id, goToBuilder = false) => {
    setShadeId(id);
    setPicked((p) => ({ id, n: p.n + 1 }));
    if (goToBuilder) document.getElementById("build")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main>
        <Hero shade={shade} onShade={chooseShade} />
        <Looks onTry={(id) => chooseShade(id, true)} />
        <Builder picked={picked} />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
