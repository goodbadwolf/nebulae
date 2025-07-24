import { createRoot } from "react-dom/client";

import { PlaygroundApp } from "./app";

const container = document.getElementById("playground-root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<PlaygroundApp />);
