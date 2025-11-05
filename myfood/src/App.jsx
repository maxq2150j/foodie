import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Navigationbar } from "./components/Navigationbar.jsx";
import { Home } from "./components/Home.jsx";
import RestaurantHomePage from "./components/RestaurantHomePage.jsx";
import RestaurantDashboard from "./components/RestaurantDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Cart from "./components/Cart.jsx";
import AddMenuForm from "./components/AddMenuForm.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import DisplayAllMenus from "./components/DisplayAllMenus.jsx";
import AboutUs from "./components/AboutUs.jsx";
import ContactUs from "./components/ContactUs.jsx";
import React from "react";

function RequireAuth({ children }) {
  // simple client-side guard using localStorage
  try {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth || !auth.authenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}


function App() {

  return (
    <BrowserRouter>
      <Navigationbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes: require login */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/restaurant-home"
          element={
            <RequireAuth>
              <RestaurantHomePage />
            </RequireAuth>
          }
        />

        <Route
          path="/restaurant-dashboard"
          element={
            <RequireAuth>
              <RestaurantDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />

        <Route
          path="/addMenus"
          element={
            <RequireAuth>
              <AddMenuForm />
            </RequireAuth>
          }
        />

        <Route
          path="/displayMenus"
          element={
            <RequireAuth>
              <DisplayAllMenus />
            </RequireAuth>
          }
        />

        <Route
          path="/about-us"
          element={
            <RequireAuth>
              <AboutUs />
            </RequireAuth>
          }
        />

        <Route
          path="/contact-us"
          element={
            <RequireAuth>
              <ContactUs />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Helper to protect routes */}
      
    </BrowserRouter>
  )
}

export default App;