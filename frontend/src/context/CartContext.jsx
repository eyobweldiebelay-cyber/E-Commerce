import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  });

  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user) {
      setCart({
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.get('/cart');

      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', {
      productId,
      quantity
    });

    await loadCart();
  };

  const updateQuantity = async (productId, quantity) => {
    await api.put('/cart', {
      productId,
      quantity
    });

    await loadCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/cart/${productId}`);

    await loadCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');

    await loadCart();
  };

  const itemCount = cart.items.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        loadCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}