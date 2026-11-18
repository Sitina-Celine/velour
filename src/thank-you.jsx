import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThankYou from "./pages/ThankYou.jsx";
import "./styles/base.css";
import "./styles/thank-you.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThankYou />
  </StrictMode>
);
