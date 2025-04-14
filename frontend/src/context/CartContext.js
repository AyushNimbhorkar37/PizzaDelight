import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios"; 
import { useAuth } from './AuthContext'; 

function getCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
}

const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(getCartFromLocalStorage());
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useAuth(); 


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    // Calculate total price
    const newTotal = cart.reduce((acc, item) => {
      return acc + (item.basePrice || 0) * (item.quantity || 1);
    }, 0);

    setTotal(newTotal);

    // Calculate total number of items
    const newCartItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartItems(newCartItems);
  }, [cart]);

  const isSameItem = (item, pizza) => {
    return (
      item.name === pizza.name &&
      item.base === pizza.base &&
      item.sauce === pizza.sauce &&
      item.cheese === pizza.cheese &&
      JSON.stringify([...item.selectedToppings].sort()) === JSON.stringify([...pizza.selectedToppings].sort())
    );
  };

  // Add item to cart
  const addToCart = (pizza) => {
    const existingItem = cart.find((item) => isSameItem(item, pizza));

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          isSameItem(item, pizza)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      const newItem = {
        id: `${pizza.name}-${pizza.base}-${pizza.size}-${JSON.stringify(pizza.selectedToppings.sort())}`, 
        name: pizza.name,
        base: pizza.base,
        size: pizza.size,
        image: pizza.image,
        basePrice: pizza.basePrice,
        sauce: pizza.sauce,
        cheese: pizza.cheese,
        selectedToppings: pizza.selectedToppings || [],
        quantity: 1,
      };
      setCart((prevCart) => [...prevCart, newItem]);
    }
  };

  // Remove specific item 
  const removeItem = (pizza) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !isSameItem(item, pizza)) 
    );
  };

  // Increase item quantity
const increaseAmount = (pizza) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.id === pizza.id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    )
  );
};

// Decrease item quantity
const decreaseAmount = (pizza) => {
  setCart((prevCart) =>
    prevCart
      .map((item) => {
        if (item.id === pizza.id) {
          if (item.quantity === 1) {
            return null; 
          }
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter(Boolean) 
  );
};

// Clear the cart
const clearCart = () => {
  setCart([]);
};

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        total,
        addToCart,
        removeItem,
        increaseAmount,
        decreaseAmount,
        clearCart,
        // placeOrder,
        alertMessage,
        showAlert,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => useContext(CartContext);

export { CartContext, CartProvider, useCart };