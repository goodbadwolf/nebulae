import "../styles/globals.scss";

import { createRoot } from "react-dom/client";

import { WelcomePage } from "../pages/welcome";

function initializeWelcome() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<WelcomePage />);
}

initializeWelcome();
