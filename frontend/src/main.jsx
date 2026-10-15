import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import theme from "./theme";
import { NotificacionProvider } from "./context/NotificacionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificacionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificacionProvider>
    </ThemeProvider>
  </React.StrictMode>
);
