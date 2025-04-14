import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../styles/CartPage.css";
import CustomAlert from "../components/CustomAlert";  
import ConfirmationAlert from "../components/ConfirmationAlert";  
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";


const CartPage = () => {
  const {
    cart,
    increaseAmount,
    decreaseAmount,
    removeItem,
    clearCart,
  } = useCart();


  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  // State to manage address input
  const [address, setAddress] = useState("");
  const [isAddressFilled, setIsAddressFilled] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);  
  const [confirmationMessage, setConfirmationMessage] = useState("");  

  // Calculate Item Price (basePrice + toppings)
  const calculateItemPrice = (item) => {
    const basePrice = Number(item.basePrice) || 0;
    const toppingsPrice = (item.selectedToppings || []).reduce(
      (acc, toppingName) => {
        const toppingsList = [
          { name: "Onion", price: 20 },
          { name: "Capsicum", price: 25 },
          { name: "Mushroom", price: 30 },
          { name: "Olives", price: 35 },
          { name: "Spinach", price: 35 },
          { name: "Tomato", price: 20 },
        ];
        const topping = toppingsList.find((t) => t.name === toppingName);
        return topping ? acc + topping.price : acc;
      },
      0
    );
    return basePrice + toppingsPrice;
  };

  // Total Cart Price (without tax)
  const totalPrice = cart.reduce((acc, item) => {
    const itemPrice = calculateItemPrice(item);
    return acc + itemPrice * item.quantity;
  }, 0);

  // Tax Calculation (5%)
  const tax = totalPrice * 0.05;

  // Total Price including tax
  const totalWithTax = totalPrice + tax;

  // Handle address input change
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  // Handle closing the custom alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const { user } = useAuth(); 

  // Update stock for ingredients and toppings
  const updatePizzaStock = async () => {
    try {
      const ingredients = cart.flatMap((item) => {
        const ingredientsList = [
          item.base,
          item.sauce,
          item.cheese,
          ...(item.ingredients || []),
        ].filter(Boolean);

        const toppingsList = item.selectedToppings || [];
        return [...ingredientsList, ...toppingsList];
      });

      const uniqueIngredients = [...new Set(ingredients)];

      for (let ingredientName of uniqueIngredients) {
        try {
          const response = await axios.patch(
            `http://localhost:5000/api/inventory/${ingredientName}`,
            {
              quantity: 1,
            }
          );

          if (response.status !== 200) {
            setAlertMessage(`Error updating stock for ${ingredientName}.`);
            setShowAlert(true);
            return false;
          }
        } catch (error) {
          console.error(`Error updating stock for ${ingredientName}:`, error);
          setAlertMessage(`Error updating stock for ${ingredientName}.`);
          setShowAlert(true);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error updating pizza stock:", error);
      setAlertMessage("Error updating pizza stock. Please try again.");
      setShowAlert(true);
      return false;
    }
  };

  // PLACING ORDER
  const placeOrder = async () => {
    setIsPlacingOrder(true);

    const stockUpdated = await updatePizzaStock();
    if (!stockUpdated) {
      setIsPlacingOrder(false);
      return;
    }

    try {
      const orderData = {
        pizzas: cart.map((item) => ({
          pizzaId: item._id,
          quantity: item.quantity,
          selectedToppings: (item.selectedToppings || []).map((topping) => ({
            name: topping,
            quantity: 1,
          })),
        })),
        paymentId: "test_payment_id",
        paymentStatus: "paid",
        address: address,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      );

      if (response.status === 201) {
        setAlertMessage("Order Placed Successfully! 🎉");
        setShowAlert(true);
        setTimeout(() => {
          clearCart();
          setAddress("");
        }, 2000);
      } else {
        throw new Error("Failed to place order.");
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message || error
      );
      setAlertMessage("Error placing the order. Please try again.");
      setShowAlert(true);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (address.trim() === "") {
      setAlertMessage("Please provide a delivery address!");
      setShowAlert(true);
      return;
    }

    setConfirmationAction(() => placeOrder);
    setConfirmationMessage("Are you sure you want to place the order?");
    setShowConfirmationAlert(true);
  };

  // Handle remove item with confirmation
  const handleRemoveItem = (item) => {
    setConfirmationAction(() => () => removeItem(item)); 
    setConfirmationMessage(
      `Are you sure you want to remove ${item.name} pizza from the cart?`
    );  
    setShowConfirmationAlert(true);  
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    setConfirmationAction(() => clearCart);  
    setConfirmationMessage("Are you sure you want to clear the entire cart?");  
    setShowConfirmationAlert(true);  
  };

  // Close the confirmation alert and proceed with action
  const confirmAction = async () => {
    await confirmationAction();
    setShowConfirmationAlert(false);
  };

  // Cancel action from confirmation alert
  const cancelAction = () => {
    setShowConfirmationAlert(false);  
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/menu">
            <button className="shop-now-btn">Shop Now</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart 🛒</h1>

      <div className="address-input-container">
        <h3>Enter Delivery Address</h3>
        <textarea
          value={address}
          onChange={handleAddressChange}
          placeholder="The recipient's name, street address, city, state, and postal code/zip code"
          rows="3"
          className="address-input"
        />
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => {
            const itemPrice = calculateItemPrice(item);

            return (
              <div className="cart-item-card" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h2 className="item-name">{item.name}</h2>

                  {item.size && (
                    <p>
                      <strong>Size:</strong> {item.size}
                    </p>
                  )}

                  {item.base && (
                    <p>
                      <strong>Base:</strong> {item.base}
                    </p>
                  )}

                  {item.sauce && (
                    <p>
                      <strong>Sauce:</strong> {item.sauce}
                    </p>
                  )}

                  {item.cheese && (
                    <p>
                      <strong>Cheese:</strong> {item.cheese}
                    </p>
                  )}

                  {item.selectedToppings &&
                    item.selectedToppings.length > 0 && (
                      <p>
                        <strong>Toppings:</strong>{" "}
                        {item.selectedToppings.join(", ")}
                      </p>
                    )}

                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => decreaseAmount(item)}
                    >
                      -
                    </button>
                    <span className="quantity-number">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => increaseAmount(item)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ₹{(itemPrice * item.quantity).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item)}  
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2 className="order-summary">Order Summary</h2>
          <p>
            Total Items: {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </p>
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
          <p>Tax (5%): ₹{tax.toFixed(2)}</p>
          <h3>Total (including tax): ₹{totalWithTax.toFixed(2)}</h3>
          <p className="estimated-delivery">
            Estimated Delivery Time: 30-45 mins
          </p>

          <button
            className="checkout-btn"
            onClick={handleProceedToCheckout}
            disabled={isPlacingOrder} 
          >
            {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout"}
          </button>

          <button className="clear-cart-btn" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      </div>

      {showAlert && (
        <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
      )}

      {showConfirmationAlert && (
        <ConfirmationAlert
          message={confirmationMessage}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
    </div>
  );
};

export default CartPage;