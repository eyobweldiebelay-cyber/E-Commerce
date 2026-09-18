import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  MapPin,
  Phone
} from 'lucide-react';

import api from '../../api/api';

function OrderConfirmation() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/orders/${orderId}`
      );

      setOrder(response.data.order);
      setItems(response.data.items || []);

    } catch (error) {
      console.error(
        'Failed to load order:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Failed to load order information.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="order-confirmation-page">
        <div className="container">
          <div className="page-loading">
            Loading order...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-confirmation-page">
        <div className="container">
          <div className="products-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-confirmation-page">
        <div className="container">
          <div className="empty-products">
            <h2>Order not found</h2>

            <Link to="/products">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="order-confirmation-page">
      <div className="container">

        <div className="confirmation-card">

          <div className="confirmation-icon">
            <CheckCircle size={65} />
          </div>

          <h1>Order Confirmed!</h1>

          <p className="confirmation-message">
            Your payment was successful and your
            order has been placed successfully.
          </p>

          <div className="order-number">
            <span>Order Number</span>
            <strong>#{order.id}</strong>
          </div>

          <div className="order-status">
            <Package size={20} />

            <div>
              <span>Order Status</span>
              <strong>{order.status}</strong>
            </div>
          </div>

          <div className="confirmation-divider"></div>

          <div className="confirmation-section">

            <h2>Delivery Information</h2>

            <div className="delivery-info">

              <div>
                <MapPin size={19} />

                <div>
                  <span>Address</span>
                  <strong>{order.address}</strong>
                </div>
              </div>

              <div>
                <Phone size={19} />

                <div>
                  <span>Phone</span>
                  <strong>{order.phone}</strong>
                </div>
              </div>

            </div>

          </div>

          <div className="confirmation-divider"></div>

          <div className="confirmation-section">

            <h2>Order Items</h2>

            <div className="confirmation-items">

              {items.map((item) => (
                <div
                  className="confirmation-item"
                  key={item.id}
                >

                  <div className="confirmation-item-image">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>No Image</span>
                    )}

                  </div>

                  <div className="confirmation-item-info">

                    <h3>{item.name}</h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <strong>
                    {Number(item.subtotal).toFixed(2)} ETB
                  </strong>

                </div>
              ))}

            </div>

          </div>

          <div className="confirmation-divider"></div>

          <div className="confirmation-summary">

            <div>
              <span>Subtotal</span>
              <span>
                {Number(order.subtotal).toFixed(2)} ETB
              </span>
            </div>

            <div>
              <span>Delivery</span>
              <span>
                {Number(order.delivery_fee).toFixed(2)} ETB
              </span>
            </div>

            <div className="confirmation-total">
              <strong>Total</strong>
              <strong>
                {Number(order.total).toFixed(2)} ETB
              </strong>
            </div>

          </div>

          <div className="confirmation-actions">

            <Link
              to="/orders"
              className="view-orders-button"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

export default OrderConfirmation;