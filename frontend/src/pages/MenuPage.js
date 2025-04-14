import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; 
import "../styles/MenuPage.css";
import CustomAlert from "../components/CustomAlert"; 
import { useEffect } from "react";


const pizzas = [
  {
    id: 1,
    name: "Margherita",
    basePrice: 599,
    basePriceIncrement: 50,
    saucePriceIncrement: 65, 
    cheesePriceIncrement: 70, 
    veggiePriceIncrement: 35, 
    image:
      "https://www.shutterstock.com/shutterstock/photos/606355589/display_1500/stock-photo-pizza-with-ham-and-salami-garnished-with-olives-606355589.jpg",
    baseOptions: [
      "Thin Crust",
      "Thick Crust",
      "Gluten-Free",
      "Stuffed Crust",
      "Cauliflower",
    ],
    sauceOptions: ["Tomato", "Pesto", "BBQ", "Garlic Butter", "Creamy Alfredo"],
    cheeseOptions: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Goat Cheese",
      "Vegan Cheese",
    ],
    veggieOptions: ["Olives", "Mushrooms", "Onions", "Peppers"],
  },
  {
    id: 2,
    name: "Pepperoni",
    basePrice: 699,
    basePriceIncrement: 50, 
    saucePriceIncrement: 65, 
    cheesePriceIncrement: 70, 
    veggiePriceIncrement: 35, 
    image:
      "https://www.shutterstock.com/shutterstock/photos/514457071/display_1500/stock-photo-pepperoni-pizza-on-a-board-restaurant-514457071.jpg",
    baseOptions: [
      "Thin Crust",
      "Thick Crust",
      "Gluten-Free",
      "Stuffed Crust",
      "Cauliflower",
    ],
    sauceOptions: ["Tomato", "BBQ", "Pesto", "Garlic Butter", "Spicy Marinara"],
    cheeseOptions: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Goat Cheese",
      "Vegan Cheese",
    ],
    veggieOptions: ["Olives", "Mushrooms", "Peppers", "Onions"],
  },
  {
    id: 3,
    name: "BBQ Chicken",
    basePrice: 899,
    basePriceIncrement: 50, 
    saucePriceIncrement: 65, 
    cheesePriceIncrement: 70,
    veggiePriceIncrement: 35, 
    image:
      "https://www.allrecipes.com/thmb/qZ7LKGV1_RYDCgYGSgfMn40nmks=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d.jpg",
    baseOptions: [
      "Thin Crust",
      "Thick Crust",
      "Gluten-Free",
      "Stuffed Crust",
      "Cauliflower",
    ],
    sauceOptions: [
      "BBQ",
      "Garlic Butter",
      "Buffalo",
      "Tomato",
      "Creamy Alfredo",
    ],
    cheeseOptions: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Goat Cheese",
      "Vegan Cheese",
    ],
    veggieOptions: ["Olives", "Peppers", "Onions", "Spinach"],
  },
  {
    id: 4,
    name: "Hawaiian",
    basePrice: 749,
    basePriceIncrement: 50,
    saucePriceIncrement: 65,     
    cheesePriceIncrement: 70,
    veggiePriceIncrement: 35,
    image:
      "https://www.shutterstock.com/shutterstock/photos/2126210381/display_1500/stock-photo-pizza-with-mozzarella-cheese-salami-chicken-meat-beef-ham-tomato-sauce-pepper-spices-italian-2126210381.jpg",
    baseOptions: [
      "Thin Crust",
      "Thick Crust",
      "Gluten-Free",
      "Stuffed Crust",
      "Cauliflower",
    ],
    sauceOptions: ["Tomato", "BBQ", "Pesto", "Garlic Butter", "Spicy Marinara"],
    cheeseOptions: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Goat Cheese",
      "Vegan Cheese",
    ],
    veggieOptions: ["Onions", "Olives", "Mushrooms", "Peppers"],
  },
  {
    id: 5,
    name: "Veggie Supreme",
    basePrice: 599,
    basePriceIncrement: 50, 
    saucePriceIncrement: 65, 
    cheesePriceIncrement: 70, 
    veggiePriceIncrement: 35, 
    image:
      "https://www.shutterstock.com/shutterstock/photos/1176416086/display_1500/stock-photo-pizza-home-maded-1176416086.jpg",
    baseOptions: [
      "Thin Crust",
      "Thick Crust",
      "Gluten-Free",
      "Stuffed Crust",
      "Cauliflower",
    ],
    sauceOptions: ["Tomato", "BBQ", "Pesto", "Garlic Butter", "Spicy Marinara"],
    cheeseOptions: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Goat Cheese",
      "Vegan Cheese",
    ],
    veggieOptions: ["Olives", "Mushrooms", "Onions", "Peppers"],
  },
  {
    id: 6,
    name: "Meat Lovers",
    basePrice: 899,
    basePriceIncrement: 50, 
    saucePriceIncrement: 65, 
    cheesePriceIncrement: 70, 
    veggiePriceIncrement: 35, 
    image:
      "https://www.shutterstock.com/shutterstock/photos/1993220516/display_1500/stock-photo-homemade-indian-chicken-tikka-masala-pizza-with-onions-and-cilantro-1993220516.jpg",
    baseOptions: [
      "Thin Crust",
      "Thick Crust",
      "Gluten-Free",
      "Stuffed Crust",
      "Cauliflower",
    ],
    sauceOptions: ["Tomato", "BBQ", "Pesto", "Garlic Butter", "Spicy Marinara"],
    cheeseOptions: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Goat Cheese",
      "Vegan Cheese",
    ],
    veggieOptions: ["Olives", "Mushrooms", "Onions", "Peppers"],
  },
];

const MenuPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);  
  const [alertMessage, setAlertMessage] = useState("");  

  const [pizzaCustomizations, setPizzaCustomizations] = useState(
    pizzas.reduce((acc, pizza) => {
      acc[pizza.id] = {
        base: "", 
        sauce: "",  
        cheese: "",  
        veggies: [],  
      };
      return acc;
    }, {})
  );

  useEffect(() => {
      window.scrollTo(0, 0); 
    }, []);

  const calculatePrice = (pizza, customizations) => {
    let totalPrice = pizza.basePrice;
  
    if (customizations.base) totalPrice += pizza.basePriceIncrement;
    if (customizations.sauce) totalPrice += pizza.saucePriceIncrement;
    if (customizations.cheese) totalPrice += pizza.cheesePriceIncrement;
  
    if (customizations.veggies && customizations.veggies.length > 0) {
      totalPrice += customizations.veggies.length * pizza.veggiePriceIncrement;
    }
  
    return totalPrice;
  };

  const handleCustomizationChange = (pizzaId, e) => {
    const { name, value, checked } = e.target;

    setPizzaCustomizations((prev) => {
      const updatedCustomizations = { ...prev };

      if (name === "veggies") {
        updatedCustomizations[pizzaId] = {
          ...updatedCustomizations[pizzaId],
          veggies: checked
            ? [...updatedCustomizations[pizzaId].veggies, value]
            : updatedCustomizations[pizzaId].veggies.filter(
                (veggie) => veggie !== value
              ),
        };
      } else {
        updatedCustomizations[pizzaId] = {
          ...updatedCustomizations[pizzaId],
          [name]: value,
        };
      }

      return updatedCustomizations;
    });
  };

  const handleAddToCart = (pizza, customizations) => {
    if (
      !customizations.base ||
      !customizations.sauce ||
      !customizations.cheese
    ) {
      setAlertMessage("Please select base, sauce, and cheese for your pizza.");
      setShowAlert(true);  
    }
  
    const itemToAdd = {
      name: pizza.name,
      base: customizations.base,  
      size: pizza.size || "Medium", 
      image: pizza.image,
      basePrice: calculatePrice(pizza, customizations),  
      sauce: customizations.sauce,  
      cheese: customizations.cheese,  
      selectedToppings: customizations.veggies || [],   
      quantity: 1,
    };
  
    addToCart(itemToAdd);
    setAlertMessage("Pizza Added to Cart successfully!");
    setShowAlert(true);  

    setPizzaCustomizations((prev) => ({
      ...prev,
      [pizza.id]: { base: "", sauce: "", cheese: "", veggies: [] },
    }));
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">Our Delicious Pizzas 🍕</h2>
      <div className="pizza-list-menu">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="pizza-card-menu">
            <img
              src={pizza.image}
              alt={pizza.name}
              className="pizza-image-menu"
            />
            <div className="pizza-info-menu">
              <h3 className="pizza-name-menu">{pizza.name}</h3>
              <p className="pizza-price-menu">
                ₹{calculatePrice(pizza, pizzaCustomizations[pizza.id])}
              </p>

              <div className="customization-options">
                <label>Base:</label>
                <select
                  name="base"
                  value={pizzaCustomizations[pizza.id].base}
                  onChange={(e) => handleCustomizationChange(pizza.id, e)}
                >
                  <option value="">Select Base</option>
                  {pizza.baseOptions.map((base) => (
                    <option key={base} value={base}>
                      {base}
                    </option>
                  ))}
                </select>

                <label>Sauce:</label>
                <select
                  name="sauce"
                  value={pizzaCustomizations[pizza.id].sauce}
                  onChange={(e) => handleCustomizationChange(pizza.id, e)}
                >
                  <option value="">Select Sauce</option>
                  {pizza.sauceOptions.map((sauce) => (
                    <option key={sauce} value={sauce}>
                      {sauce}
                    </option>
                  ))}
                </select>

                <label>Cheese:</label>
                <select
                  name="cheese"
                  value={pizzaCustomizations[pizza.id].cheese}
                  onChange={(e) => handleCustomizationChange(pizza.id, e)}
                >
                  <option value="">Select Cheese</option>
                  {pizza.cheeseOptions.map((cheese) => (
                    <option key={cheese} value={cheese}>
                      {cheese}
                    </option>
                  ))}
                </select>

                <label>Toppings:</label>
                {pizza.veggieOptions.map((veggie) => (
                  <div key={veggie} className="veggie-option">
                    <input
                      type="checkbox"
                      name="veggies"
                      value={veggie}
                      checked={pizzaCustomizations[pizza.id].veggies.includes(
                        veggie
                      )}
                      onChange={(e) => handleCustomizationChange(pizza.id, e)}
                    />
                    <label>{veggie}</label>
                  </div>
                ))}
              </div>

              <button
                className="add-to-cart-btn"
                onClick={() =>
                  handleAddToCart(pizza, pizzaCustomizations[pizza.id])
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="view-cart">
        <button className="view-cart-btn" onClick={() => navigate("/cart")}>
          View Cart
        </button>
      </div>

      {showAlert && (
        <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </div>
  );
};

export default MenuPage;