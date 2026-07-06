import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";

import Home from "../pages/Home/Home";
import Salons from "../pages/Salons/Salons";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/salons" element={<Salons />} />
      </Route>
    </Routes>
  );
}