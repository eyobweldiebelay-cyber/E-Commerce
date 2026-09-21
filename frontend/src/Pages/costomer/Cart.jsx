import { Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';

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
        <div className="cart-container">
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
        <div className="cart-container">

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

      <div className="cart-container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="cart-header">

          <div>
            <Link
              to="/products"
              className="cart-back-link"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

            <h1>Shopping Cart</h1>

            <p>
              {cart.items.length}{' '}
              {cart.items.length === 1
                ? 'item'
                : 'items'}{' '}
              in your cart
            </p>
          </div>

        </div>


        {/* =========================
            CART LAYOUT
        ========================== */}

        <div className="cart-layout">

          {/* =========================
              CART ITEMS
          ========================== */}

          <div className="cart-items">

            {cart.items.map((item) => {

              /*
                Database normally contains:

                item.image = "jacket.jpg"

                Browser needs:

                http://localhost:8800/uploads/products/jacket.jpg
              */

              const imageUrl = item.image
                ? item.image.startsWith('http')
                  ? item.image
                  : `http://localhost:8800/uploads/products/${item.image}`
                : null;

              const price = Number(item.price || 0);
              const quantity = Number(item.quantity || 1);
              const itemTotal = price * quantity;

              return (
                <div
                  className="cart-item"
                  key={item.product_id}
                >

                  {/* PRODUCT IMAGE */}

                  <div className="cart-item-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                      />
                    ) : (
                      <div className="cart-no-image">
                        No Image
                      </div>
                    )}

                  </div>


                  {/* PRODUCT INFORMATION */}

                  <div className="cart-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p className="cart-item-price">
                      {price.toFixed(2)} ETB
                    </p>

                    {/* QUANTITY */}

                    <div className="cart-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(item)
                        }
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>

                      <span>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncrease(item)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                  </div>


                  {/* ITEM TOTAL */}

                  <div className="cart-item-total">

                    <strong>
                      {itemTotal.toFixed(2)} ETB
                    </strong>

                    <button
                      type="button"
                      className="remove-cart-button"
                      onClick={() =>
                        handleRemove(item.product_id)
                      }
                      title="Remove product"
                      aria-label="Remove product"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>


          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                {Number(cart.subtotal).toFixed(2)} ETB
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                {Number(cart.deliveryFee).toFixed(2)} ETB
              </span>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-total">

              <span>
                Total
              </span>

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