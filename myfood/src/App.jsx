import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigationbar } from "./components/Navigationbar.jsx";
import { Home } from "./components/Home.jsx";
import RestaurantHomePage from "./components/RestaurantHomePage.jsx";
import AddMenuForm from "./components/AddMenuForm.jsx";


function App() {

  return (
    <BrowserRouter>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<RestaurantHomePage />} />
        <Route path="/addMenus" element={<AddMenuForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;