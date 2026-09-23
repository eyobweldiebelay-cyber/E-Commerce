import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin } from 'lucide-react';

import api from '../../api/api';
import { useCart } from '../../context/CartContext';

function Checkout() {
  const navigate = useNavigate();
  const { cart, loading } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post('/orders', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      const orderId = response.data.orderId;

      if (!orderId) {
        setError('Order was created but no order ID was returned.');
        return;
      }

      navigate(`/payment/${orderId}`);

    } catch (error) {
      console.error('Failed to create order:', error);

      setError(
        error.response?.data?.message ||
        'Failed to create order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="page-loading">
            Loading checkout...
          </div>
        </div>
      </main>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h1>Your Cart is Empty</h1>

            <p>
              Add products to your cart before checkout.
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
    <main className="checkout-page">
      <div className="container">

        <div className="checkout-header">
          <h2>Checkout</h2>
        
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="checkout-layout">

          {/* Delivery Information */}
          <div className="checkout-form-container">

            <h2>Delivery Information</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Name</label>

                <div className="input-wrapper">
                  <User size={18} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>

                <div className="input-wrapper">
                  <Phone size={18} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>

                <div className="input-wrapper">
                  <MapPin size={18} />

                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your delivery address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={submitting}
              >
                {submitting
                  ? 'Creating Order...'
                  : 'Continue to Payment'}
              </button>

            </form>

          </div>

          {/* Order Summary */}
          <aside className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-products">

              {cart.items.map((item) => (
                <div
                  className="checkout-product"
                  key={item.product_id}
                >
                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      {item.quantity} ×{' '}
                      {Number(item.price).toFixed(2)} ETB
                    </p>
                  </div>

                  <strong>
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)} ETB
                  </strong>
                </div>
              ))}

            </div>

            <div className="summary-divider"></div>

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

          </aside>

        </div>

      </div>
    </main>
  );
}

export default Checkout;