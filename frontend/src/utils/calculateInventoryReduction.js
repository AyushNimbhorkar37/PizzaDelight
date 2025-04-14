// utils/calculateInventoryReduction.js

export const calculateInventoryReduction = (cartItems) => {
    const reduction = {};
  
    cartItems.forEach((item) => {
      const quantity = item.quantity;
  
      // PizzaBase
      if (item.selectedCrust) {
        reduction[item.selectedCrust] = (reduction[item.selectedCrust] || 0) + quantity;
      }
  
      // Sauce
      if (item.selectedSauce) {
        reduction[item.selectedSauce] = (reduction[item.selectedSauce] || 0) + quantity;
      }
  
      // Cheese
      if (item.selectedCheese) {
        reduction[item.selectedCheese] = (reduction[item.selectedCheese] || 0) + quantity;
      }
  
      // Veggies/Toppings
      if (item.selectedVeggies && Array.isArray(item.selectedVeggies)) {
        item.selectedVeggies.forEach((veggie) => {
          reduction[veggie] = (reduction[veggie] || 0) + quantity;
        });
      }
    });
  
    return reduction;
  };
  