import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/authModal"; 
import "../styles/HomePage.css";


const sampleMenu = [
  { id: 1, name: "Margherita", price: 599, image: "https://www.shutterstock.com/shutterstock/photos/606355589/display_1500/stock-photo-pizza-with-ham-and-salami-garnished-with-olives-606355589.jpg" },
  { id: 2, name: "Pepperoni", price: 699, image: "https://www.shutterstock.com/shutterstock/photos/514457071/display_1500/stock-photo-pepperoni-pizza-on-a-board-restaurant-514457071.jpg" },
  { id: 3, name: "BBQ Chicken", price: 899, image: "https://www.allrecipes.com/thmb/qZ7LKGV1_RYDCgYGSgfMn40nmks=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d.jpg" },
  { id: 4, name: "Hawaiian", price: 749, image: "https://www.shutterstock.com/shutterstock/photos/2126210381/display_1500/stock-photo-pizza-with-mozzarella-cheese-salami-chicken-meat-beef-ham-tomato-sauce-pepper-spices-italian-2126210381.jpg" },
  { id: 5, name: "Veggie Supreme", price: 599, image: "https://www.shutterstock.com/shutterstock/photos/1176416086/display_1500/stock-photo-pizza-home-maded-1176416086.jpg" },
  { id: 6, name: "Meat Lovers", price: 899, image: "https://www.shutterstock.com/shutterstock/photos/1993220516/display_1500/stock-photo-homemade-indian-chicken-tikka-masala-pizza-with-onions-and-cilantro-1993220516.jpg" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    window.scrollTo(0, 0); 
  
    if (userToken) {
      setIsAuthenticated(true);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem("userToken", "true");  
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsAuthenticated(false);
    setShowAuthModal(true);
  };

  return (
    <div className="homepage">
      {showAuthModal && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuthModal(false)} />}
      
      {isAuthenticated && (
        <>
          <h1 className="homepage-title">Welcome to Pizza Delight 🍕</h1>
          <h2 className="homepage-subtitle">Our Featured Medium Sized Pizzas 😋</h2>

          <div className="pizza-container">
            {sampleMenu.map((item) => (
              <div key={item.id} className="pizza-card">
                <img src={item.image} alt={item.name} className="pizza-image" />
                <div className="pizza-info">
                  <h3 className="pizza-name">{item.name}</h3>
                  <p className="pizza-price">Starting Price: ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="go-to-menu-btn" onClick={() => navigate("/menu")}>
            Go to Menu
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;