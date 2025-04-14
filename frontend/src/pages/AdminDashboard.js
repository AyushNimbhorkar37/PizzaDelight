import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert"; 
import ConfirmationAlert from "../components/ConfirmationAlert"; 
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [inventory, setInventory] = useState({});
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 
  const [showAlert, setShowAlert] = useState(false); 
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); 

  const navigate = useNavigate();

  const categoryPrices = {
    pizzaBase: 50,
    sauce: 65,
    cheese: 70,
    toppings: 35,
  };

  useEffect(() => {
    fetchInventory();
    window.scrollTo(0, 0); 
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }
  
      const { data } = await axios.get("http://localhost:5000/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const groupedInventory = data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
  
      setInventory(groupedInventory);
  
      // Check for low stock
      const lowStockItems = data.filter(item => item.quantity < 10);
      if (lowStockItems.length > 0) {
        const itemNames = lowStockItems.map(item => `${item.name} (${item.quantity} left)`).join(", ");
        setTimeout(() => {
          setAlertMessage(`⚠️ Low Stock Alert:<br/>${itemNames.split("\n").join("<br/>")}`);
          setShowAlert(true);
        }, 1000); 
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      if (error.response?.status === 401) {
        navigate("/admin-login");
      } else {
        setAlertMessage("Failed to fetch inventory.");
        setShowAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    const { name, quantity, category } = newItem;
    if (!name.trim() || !quantity || !category) {
      setAlertMessage("Please fill out all fields properly.");
      setShowAlert(true); 
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const price = categoryPrices[category];
      await axios.post("http://localhost:5000/api/inventory", { ...newItem, price }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlertMessage("Ingredient added successfully!");
      setShowAlert(true);  
      setNewItem({ name: "", quantity: "", category: "" });
      fetchInventory();
    } catch (error) {
      console.error("Error adding item:", error);
      setAlertMessage("Failed to add ingredient.");
      setShowAlert(true);  
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setAlertMessage("You are not logged in.");
        setShowAlert(true);
        console.log("Token is missing.");
        return;
      }

      const url = `http://localhost:5000/api/inventory/${confirmDelete}`;
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlertMessage("Ingredient deleted successfully!");
      setShowAlert(true);
      fetchInventory();  
      setConfirmDelete(null);  
    } catch (error) {
      console.error("Error occurred during DELETE request:", error);

      if (error.response) {
        setAlertMessage(`Error: ${error.response.data.message || 'Failed to delete ingredient'}`);
      } else {
        setAlertMessage("Network error or server not reachable.");
      }

      setShowAlert(true); 
      setConfirmDelete(null);  
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    const { name, quantity, category } = newItem;
    if (!name.trim() || !quantity || !category) {
      setAlertMessage("Please fill out all fields properly.");
      setShowAlert(true);  
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const price = categoryPrices[category];
      await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, {
        name, quantity, category, price
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlertMessage("Ingredient updated successfully!");
      setShowAlert(true);  
      setEditItem(null);
      setNewItem({ name: "", quantity: "", category: "" });
      fetchInventory();
    } catch (error) {
      console.error("Error updating item:", error);
      setAlertMessage("Failed to update ingredient.");
      setShowAlert(true);  
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard - Manage Ingredients</h2>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}

      {confirmDelete && (
        <ConfirmationAlert 
          message="Are you sure you want to delete this ingredient?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)} 
        />
      )}

      <form onSubmit={editItem ? handleUpdateItem : handleAddItem} className="add-item-form">
        <input
          type="text"
          name="name"
          placeholder="Ingredient Name"
          value={newItem.name}
          onChange={handleInputChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          required
          min="1"
        />

        <select
          name="category"
          value={newItem.category}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Category</option>
          <option value="pizzaBase">Pizza Base</option>
          <option value="sauce">Sauce</option>
          <option value="cheese">Cheese</option>
          <option value="toppings">Toppings</option>
        </select>

        <button type="submit">
          {editItem ? "Update Ingredient" : "Add Ingredient"}
        </button>
      </form>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading ingredients...</p>
        </div>
      ) : (
        <>
          <h3>Total Categories: {Object.keys(inventory).length}</h3>

          {Object.keys(inventory).map((category) => (
            <div key={category} className="inventory-category">
              <h4 className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory[category].map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>&nbsp;
                        <button
                          className="btn"
                          onClick={() => setConfirmDelete(item._id)}  
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;