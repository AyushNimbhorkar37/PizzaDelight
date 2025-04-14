import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    document.body.style.backgroundColor = "white";

    const storedCartItems = localStorage.getItem("cartItems");
    setCartItems(storedCartItems ? parseInt(storedCartItems) : 0);
  }, []);

  return (
    <nav className="navbar">
      <h1 className="logo">PizzaDelight</h1>
      <div className="nav-links">
        <Link to="/" className="nav-btns">Home</Link>
        <Link to="/menu" className="nav-btns">Menu</Link>
        <Link to="/cart" className="nav-btns">Cart</Link>

        <Link to="/admin-login">
          <button className="Log-btn">Admin Login</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
