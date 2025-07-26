import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "../components/theme-provider";
import { HomePage } from "./pages/home";
import { WelcomePage } from "./pages/welcome";

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/playground">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
