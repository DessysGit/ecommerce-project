// CartContext - Manages shopping cart state across the entire app
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create context - this will hold cart data and functions
const CartContext = createContext();

// Custom hook to use cart context easily
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// CartProvider - Wraps our app and provides cart functionality
export const CartProvider = ({ children }) => {
  // State to store cart items
  const [cartItems, setCartItems] = useState([]);
  
  // Get auth state to know if user is logged in
  const { token, isAuthenticated, user } = useAuth();

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (isAuthenticated() && token) {
      fetchCartFromBackend();
    } else {
      // If not logged in, load from localStorage
      loadCartFromLocalStorage();
    }
  }, [token]); // Re-run when token changes (login/logout)

  // Fetch cart from backend API
  const fetchCartFromBackend = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Transform backend data to match frontend format
      const transformedCart = response.data.map(item => ({
        product: {
          id: item.product_id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image_url: item.image_url,
          stock_quantity: item.stock_quantity
        },
        quantity: item.quantity
      }));
      
      setCartItems(transformedCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Load cart from localStorage (for guest users)
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]);
    }
  };

  // Save to localStorage (only for guest users)
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Add item to cart
  const addToCart = async (product) => {
    if (isAuthenticated() && token) {
      // Logged in - save to backend
      try {
        await axios.post('http://localhost:5000/api/cart/add', 
          {
            productId: product.id,
            quantity: 1
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Refresh cart from backend
        await fetchCartFromBackend();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Guest user - save to localStorage
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { product, quantity: 1 }];
        }
      });
    }
  };

  // Remove item from cart completely
  const removeFromCart = async (productId) => {
    if (isAuthenticated() && token) {
      // Logged in - remove from backend
      try {
        await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Refresh cart from backend
        await fetchCartFromBackend();
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Guest user - remove from localStorage
      setCartItems((prevItems) =>
        prevItems.filter(item => item.product.id !== productId)
      );
    }
  };

  // Update quantity of specific item
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated() && token) {
      // Logged in - update backend
      try {
        await axios.put(`http://localhost:5000/api/cart/update/${productId}`,
          { quantity: newQuantity },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Refresh cart from backend
        await fetchCartFromBackend();
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      // Guest user - update localStorage
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (isAuthenticated() && token) {
      // Logged in - clear backend
      try {
        await axios.delete('http://localhost:5000/api/cart/clear', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      // Guest user - clear localStorage
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  // Calculate total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price of all items
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0).toFixed(2);
  };

  // Value object - all functions and data we want to share
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
