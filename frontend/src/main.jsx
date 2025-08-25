import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SnackbarProvider } from "./context/SnackbarContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </StrictMode>
);
