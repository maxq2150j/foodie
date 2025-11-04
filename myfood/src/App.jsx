import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Navigationbar } from "./components/Navigationbar.jsx";
import { Home } from "./components/Home.jsx";
import RestaurantHomePage from "./components/RestaurantHomePage.jsx";
import AddMenuForm from "./components/AddMenuForm.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
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
          path="/addMenus"
          element={
            <RequireAuth>
              <AddMenuForm />
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