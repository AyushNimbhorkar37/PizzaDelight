import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const PizzaCard = ({ pizza }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="pizza-card">
            <h3>{pizza.name}</h3>
            <p>{pizza.description}</p>
            <p>Price: ${pizza.price}</p>
            <button onClick={() => addToCart(pizza)}>Add to Cart</button>
        </div>
    );
};

export default PizzaCard;
