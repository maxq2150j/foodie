import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigationbar } from "./components/Navigationbar.jsx";
import { Home } from "./components/Home.jsx";
import RestaurantHomePage from "./components/RestaurantHomePage.jsx";
import AddMenuForm from "./components/AddMenuForm.jsx";
import DisplayAllMenus from "./components/DisplayAllMenus.jsx";


function App() {

  return (
    <BrowserRouter>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<RestaurantHomePage />} />
        <Route path="/displayMenus" element={<DisplayAllMenus />} />
        <Route path="/addMenu" element={<AddMenuForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;