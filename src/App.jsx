import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RegisterCafe from "./pages/RegisterCafe";
import Map from "./pages/Map";
import CafeDetails from "./pages/CafeDetails";
import MyCafe from "./pages/MyCafe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-cafe" element={<MyCafe />} />
        <Route path="/cafes/:cafeId" element={<CafeDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-cafe" element={<RegisterCafe />} />
        <Route path="/map" element={<Map />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
