import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail: user.email })
      });
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      } else {
        console.error('Failed to fetch cart items', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch cart items', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const addToCart = useCallback(async (product) => {
    if (!user) return;

    try {
      const cartItem = { id: product.id, name: product.name, price: product.price, quantity: 1 };
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail: user.email, item: cartItem })
      });
      if (response.ok) {
        fetchCartItems();
      } else {
        console.error('Failed to add item to cart', response.statusText);
      }
    } catch (error) {
      console.error('Failed to add item to cart', error);
    }
  }, [user, fetchCartItems]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail: user.email, itemId: productId })
      });
      if (response.ok) {
        fetchCartItems();
      } else {
        console.error('Failed to remove item from cart', response.statusText);
      }
    } catch (error) {
      console.error('Failed to remove item from cart', error);
    }
  }, [user, fetchCartItems]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/api/cart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail: user.email })
      });
      if (response.ok) {
        fetchCartItems();
      } else {
        console.error('Failed to clear cart', response.statusText);
      }
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  }, [user, fetchCartItems]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return { cart, addToCart, removeFromCart, clearCart, getTotalItems };
};

export default useCart;