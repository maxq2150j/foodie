import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigationbar } from "./components/Navigationbar.jsx";
import { Home } from "./components/Home.jsx";


function App() {

  return (
    <BrowserRouter>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;