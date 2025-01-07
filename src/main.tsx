import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchMenu from "./SearchMenu.tsx";
import Reserve from "./reserve.tsx";
import MenuExtendido from "./MenuExtendido.tsx";
import './index.css'; // Ensure the path is correct
import ConfirmReserve from "./ConfirmReserve.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SearchMenu />} />
        <Route path="/reserve/:restaurantId" element={<Reserve />} />
        <Route path="/menu/:restaurantId" element={<MenuExtendido />} />
        <Route path="/confirm-reserve/:restaurantId" element={<ConfirmReserve />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
