import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiEye, FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";

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
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/UserAuth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
  }
};

// API Service
const apiService = {
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/Products`);
    return await response.json();
  },
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/Categories`);
    return await response.json();
  },
  getProductDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Products/${id}`);
    return await response.json();
  },
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/Order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  }
};

const EcommerceStore = () => {
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
    { id: 1, name: "Smartphones", icon: "📱" },
    { id: 2, name: "Laptops", icon: "💻" },
    { id: 3, name: "Audio Devices", icon: "🎧" },
    { id: 4, name: "Accessories", icon: "⌚" }
  ]);

  const [cart, setCart] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiService.getProducts();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success("Product added to cart");
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success("Product removed from cart");
  };

  const AuthModal = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "", name: "" });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (isRegisterMode) {
          await authService.register(credentials);
          toast.success("Registration successful");
          setIsRegisterMode(false);
        } else {
          const response = await authService.login(credentials);
          if (response.token) {
            localStorage.setItem("token", response.token);
            setIsAuthModalOpen(false);
            toast.success("Logged in successfully");
          }
        }
      } catch (error) {
        toast.error(isRegisterMode ? "Registration failed" : "Login failed");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">{isRegisterMode ? "Register" : "Login"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border rounded"
                value={credentials.name}
                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
              />
            )}
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
              {isRegisterMode ? "Register" : "Login"}
            </button>
          </form>
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            {isRegisterMode ? "Already have an account? Login" : "Need an account? Register"}
          </button>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="mt-4 text-gray-600 hover:text-gray-800 block w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const ProductDetails = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-2xl text-blue-600">${product.price}</p>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="mt-4 text-gray-600 hover:text-gray-800 block"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ElectroShop</h1>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border rounded-full w-64"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiUser className="w-6 h-6" />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <FiShoppingCart className="w-6 h-6" />
                </button>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-2 rounded ${selectedCategory === "all" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  All Products
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-2 rounded flex items-center ${selectedCategory === category.name ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">${product.price}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 m-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600">${item.price} x {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <button
                className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthModalOpen && <AuthModal />}
      {selectedProduct && <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default EcommerceStore;
