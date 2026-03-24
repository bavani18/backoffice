import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";   // ✅ ADD THIS
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";


function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);

  const handleLogout = () => {
    navigate("/"); // ✅ back to login page
  };

  return (
    <>
      <div className="topbar">
        {/* LEFT: open/close icon */}
        <button className="icon-btn" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <div className="company-name">
         Unipro Softwares SG Pte Ltd
        </div>

        {/* RIGHT: logout icon */}
        <button className="logout-icon-btn" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </div>

      <div className={`sidebar ${open ? "open" : "close"}`}>
        <Link className="menu" to="/Home" onClick={() => setOpen(false)}>Home</Link>
        {/* 🔥 SETUP HERE */}
          
        <Link className="menu" to="/Contact" onClick={() => setOpen(false)}>Kitchen</Link>
        <Link className="menu" to="/About" onClick={() => setOpen(false)}>Category</Link>
        <Link className="menu" to="/DishGroup" onClick={() => setOpen(false)}>Dish Group</Link>
        <Link className="menu" to="/Dish" onClick={() => setOpen(false)}>Dish</Link>
        <Link className="menu" to="/Modifier" onClick={() => setOpen(false)}>Modifier</Link>
        <Link className="menu" to="/Inventory" onClick={() => setOpen(false)}>Inventory</Link>
        <Link className="menu" to="/Settlement" onClick={() => setOpen(false)}>Settlement</Link>
        <Link className="menu" to="/SalesReport" onClick={() => setOpen(false)}>Sales Report</Link>
        <Link className="menu" to="/SltReport" onClick={() => setOpen(false)}>Slt.. Report</Link>
        <Link className="menu" to="/Member" onClick={() => setOpen(false)}>Member</Link>

        <div
           className="menu"
            onClick={() => setShowSetup(!showSetup)}
          >
           Setup
        </div>

   {showSetup && (
     <div style={{ paddingLeft: "30px" }}>
    <Link className="menu" to="/usergroup">User Group</Link>
    <Link className="menu" to="/usermaster">User Master</Link>
    </div>
   )}
 </div>
    </>
  );
}

export default Sidebar;
