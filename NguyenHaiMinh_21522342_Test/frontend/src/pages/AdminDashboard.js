import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";

// API Services
const API_BASE_URL = "http://localhost:5235/api";

// Auth Service
const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/UserAuth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
  }
};

// API Service
const apiService = {
  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/Products`);
    return await response.json();
  },
  addProduct: async (product) => {
    const response = await fetch(`${API_BASE_URL}/Products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    return await response.json();
  },
  updateProduct: async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/Products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    return await response.json();
  },
  deleteProduct: async (id) => {
    await fetch(`${API_BASE_URL}/Products/${id}`, { method: "DELETE" });
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/Categories`);
    return await response.json();
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/Users`);
    return await response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/Order`);
    return await response.json();
  }
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Wireless Earbuds",
      price: 199,
      description: "High-quality wireless earbuds with noise cancellation",
      image: "https://res.cloudinary.com/dybqfvjml/image/upload/v1730400551/omt9pvtooat33zgvp8sl.jpg",
      category: "Electronics",
      stock: 50
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 299,
      description: "Advanced smartwatch with health monitoring",
      image: "https://res.cloudinary.com/dybqfvjml/image/upload/v1730400597/wztwvzliebvdnxsc1wfs.jpg",
      category: "Electronics",
      stock: 30
    }
  ]);

  const [categories] = useState([
    { id: 1, name: "Smartphones" },
    { id: 2, name: "Laptops" },
    { id: 3, name: "Audio Devices" },
    { id: 4, name: "Accessories" }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      status: "Active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Admin",
      status: "Active"
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "John Doe",
      status: "Pending",
      date: "2024-01-20",
      total: 199,
      items: [
        { productId: 1, quantity: 1, price: 199 }
      ]
    }
  ]);

  const [currentView, setCurrentView] = useState("products");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const [productsData, usersData, ordersData] = await Promise.all([
          apiService.getProducts(),
          apiService.getUsers(),
          apiService.getOrders()
        ]);

        setProducts(productsData);
        setUsers(usersData);
        setOrders(ordersData);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, []);

  const ProductManagement = () => {
    const [newProduct, setNewProduct] = useState({
      name: "",
      price: "",
      description: "",
      category: "",
      stock: ""
    });

    const handleAddProduct = async (e) => {
      e.preventDefault();
      try {
        const response = await apiService.addProduct(newProduct);
        setProducts([...products, response]);
        toast.success("Product added successfully");
        setNewProduct({ name: "", price: "", description: "", category: "", stock: "" });
      } catch (error) {
        toast.error("Failed to add product");
      }
    };

    const handleEditProduct = async (product) => {
      setIsEditMode(true);
      setSelectedProduct(product);
      setNewProduct(product);
    };

    const handleUpdateProduct = async (e) => {
      e.preventDefault();
      try {
        await apiService.updateProduct(selectedProduct.id, newProduct);
        const updatedProducts = products.map(p =>
          p.id === selectedProduct.id ? newProduct : p
        );
        setProducts(updatedProducts);
        setIsEditMode(false);
        setSelectedProduct(null);
        setNewProduct({ name: "", price: "", description: "", category: "", stock: "" });
        toast.success("Product updated successfully");
      } catch (error) {
        toast.error("Failed to update product");
      }
    };

    const handleDeleteProduct = async (id) => {
      try {
        await apiService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={isEditMode ? handleUpdateProduct : handleAddProduct} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <select
            className="w-full p-2 border rounded"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Stock"
            className="w-full p-2 border rounded"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditMode ? "Update Product" : "Add Product"}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={() => {
                setIsEditMode(false);
                setSelectedProduct(null);
                setNewProduct({ name: "", price: "", description: "", category: "", stock: "" });
              }}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Product List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h4 className="font-semibold mt-2">{product.name}</h4>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const UserManagement = () => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <FiEdit />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const OrderTracking = () => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">
                  <select
                    className="border rounded p-1"
                    value={order.status}
                    onChange={(e) => {
                      const updatedOrders = orders.map(o =>
                        o.id === order.id ? { ...o, status: e.target.value } : o
                      );
                      setOrders(updatedOrders);
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">${order.total}</td>
                <td className="px-6 py-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <FiEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AuthModal = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await authService.login(credentials);
        if (response.token) {
          localStorage.setItem("token", response.token);
          setIsAuthModalOpen(false);
          toast.success("Logged in successfully");
        }
      } catch (error) {
        toast.error("Login failed");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Electronics Store Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiSearch className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiUser className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiLogOut className="w-5 h-5" onClick={authService.logout} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setCurrentView("products")}
            className={`px-4 py-2 rounded whitespace-nowrap ${currentView === "products" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Products
          </button>
          <button
            onClick={() => setCurrentView("users")}
            className={`px-4 py-2 rounded whitespace-nowrap ${currentView === "users" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Users
          </button>
          <button
            onClick={() => setCurrentView("orders")}
            className={`px-4 py-2 rounded whitespace-nowrap ${currentView === "orders" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Orders
          </button>
        </div>

        {currentView === "products" && <ProductManagement />}
        {currentView === "users" && <UserManagement />}
        {currentView === "orders" && <OrderTracking />}
      </div>

      {isAuthModalOpen && <AuthModal />}
    </div>
  );
};

export default AdminDashboard;
