import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";
import Booking from "../pages/Booking/Booking";
import Home from "../pages/Home/Home";
import Salons from "../pages/Salons/Salons";
import SalonDetails from "../pages/SalonDetails/SalonDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:id" element={<SalonDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Route>
    </Routes>
  );
}
