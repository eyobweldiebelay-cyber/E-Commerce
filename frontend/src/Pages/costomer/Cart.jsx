import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

import { useCart } from '../../context/CartContext';

function Cart() {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart
  } = useCart();

  const handleIncrease = async (item) => {
    try {
      await updateQuantity(
        item.product_id,
        Number(item.quantity) + 1
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert(
        error.response?.data?.message ||
        'Failed to update quantity'
      );
    }
  };

  const handleDecrease = async (item) => {
    if (Number(item.quantity) <= 1) {
      return;
    }

    try {
      await updateQuantity(
        item.product_id,
        Number(item.quantity) - 1
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert(
        error.response?.data?.message ||
        'Failed to update quantity'
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove product:', error);

      alert(
        error.response?.data?.message ||
        'Failed to remove product'
      );
    }
  };

  if (loading) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="page-loading">
            Loading cart...
          </div>
        </div>
      </main>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">

          <div className="empty-cart">

            <ShoppingBag size={55} />

            <h1>Your Cart is Empty</h1>

            <p>
              You have not added any products to your cart yet.
            </p>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="container">

        <div className="cart-header">
          <h1>Shopping Cart</h1>

          <p>
            {cart.items.length}{' '}
            {cart.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items">

            {cart.items.map((item) => (

              <div
                className="cart-item"
                key={item.product_id}
              >

                {/* Product Image */}
                <div className="cart-item-image">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>No Image</span>
                  )}

                </div>

                {/* Product Information */}
                <div className="cart-item-info">

                  <h3>{item.name}</h3>

                  <p className="cart-item-price">
                    {Number(item.price).toFixed(2)} ETB
                  </p>

                  {/* Quantity */}
                  <div className="cart-quantity">

                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={Number(item.quantity) <= 1}
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(item)}
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>

                {/* Item Total */}
                <div className="cart-item-total">

                  <strong>
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)} ETB
                  </strong>

                  <button
                    className="remove-cart-button"
                    onClick={() =>
                      handleRemove(item.product_id)
                    }
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* Order Summary */}
          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                {Number(cart.subtotal).toFixed(2)} ETB
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>
                {Number(cart.deliveryFee).toFixed(2)} ETB
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>
                {Number(cart.total).toFixed(2)} ETB
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Checkout
            </Link>

            <Link
              to="/products"
              className="continue-shopping-link"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Cart;