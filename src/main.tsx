import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./styles.css";

const BASE = "/alex/dfe-digital-standards-claude-code";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={BASE}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
