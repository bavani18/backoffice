import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";




import Login from "./pages/Login";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DishGroup from "./pages/DishGroup";
import Dish from "./pages/Dish";
import Modifier from "./pages/Modifier";
import Inventory from "./pages/Inventory";
import Settlement from "./pages/Settlement";
import SalesReport from "./pages/SalesReport";
import SltReport from "./pages/SltReport";
import Member from "./pages/Member";
import UserGroup from "./pages/usergroup";
import UserMaster from "./pages/usermaster";
import Sidebar from "./components/Sidebar";

function Layout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  // ✅ Login page la sidebar hide
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <Sidebar open={open} setOpen={setOpen} />}

      <div
        className="main-content"
        style={{
          marginLeft: isLoginPage ? "0px" : open ? "240px" : "0px",
          transition: "0.3s",
          padding: isLoginPage ? "0px" : "20px",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
          <Route path="/DishGroup" element={<DishGroup />} />
          <Route path="/Dish" element={<Dish />} />
          <Route path="/Modifier" element={<Modifier />} />
          <Route path="/Inventory" element={<Inventory />} />
          <Route path="/Settlement" element={<Settlement />} />
          <Route path="/SalesReport" element={<SalesReport />} />
          <Route path="/SltReport" element={<SltReport />} />
          <Route path="/Member" element={<Member />} />
          <Route path="/usergroup" element={<UserGroup />} />
            <Route path="/usermaster" element={<UserMaster />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}



export default App;


