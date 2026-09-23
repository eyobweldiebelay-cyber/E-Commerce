import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  XCircle
} from 'lucide-react';

import api from '../../api/api';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/orders/${id}`);

      setOrder(response.data.order);
      setItems(response.data.items || []);
    } catch (error) {
      console.error(
        'Failed to load order:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Failed to load order.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      await api.put(`/orders/${id}/cancel`);

      alert('Order cancelled successfully.');

      await loadOrder();
    } catch (error) {
      console.error(
        'Failed to cancel order:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Failed to cancel order.'
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <main className="order-details-page">
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
      <main className="order-details-page">
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
      <main className="order-details-page">
        <div className="container">
          <div className="empty-products">
            <h2>Order not found</h2>

            <Link to="/orders">
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">
      <div className="container">

        <div className="order-details-top">
          <Link
            to="/orders"
            className="back-orders-link"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>
        </div>

        <div className="order-details-header">

          <div>
            <b>
              Order #{order.id}
            </b>
          </div>

          <span
            className={`order-status-badge ${order.status}`}
          >
            {order.status}
          </span>

        </div>

        <div className="order-details-layout">

          <div className="order-details-main">

            {/* Delivery Information */}

            <section className="order-details-card">

              <div className="order-details-card-header">
                <Package size={21} />

                <h2>
                  Delivery Information
                </h2>
              </div>

              <div className="order-delivery-grid">

                <div className="order-delivery-item">

                  <MapPin size={19} />

                  <div>
                    <span>
                      Address
                    </span>

                    <strong>
                      {order.address}
                    </strong>
                  </div>

                </div>

                <div className="order-delivery-item">

                  <Phone size={19} />

                  <div>
                    <span>
                      Phone
                    </span>

                    <strong>
                      {order.phone}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

            {/* Order Items */}

            <section className="order-details-card">

              <div className="order-details-card-header">
                <Package size={21} />

                <h2>
                  Order Items
                </h2>
              </div>

              <div className="order-detail-items">

                {items.map((item) => (

                  <div
                    className="order-detail-item"
                    key={item.id}
                  >

                    <div className="order-detail-image">

                      {item.image ? (
                        <img
                          src={
                            item.image.startsWith('http')
                              ? item.image
                              : `https://e-commerce-q8od.onrender.com/uploads/products/${item.image}`
                          }
                          alt={item.name}
                        />
                      ) : (
                        <span>
                          No Image
                        </span>
                      )}

                    </div>

                    <div className="order-detail-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <b>
                        Price: {
                          Number(item.price).toFixed(2)
                        } ETB
                      </b>

                    </div>

                    <strong>
                      {
                        Number(
                          item.subtotal
                        ).toFixed(2)
                      } ETB
                    </strong>

                  </div>

                ))}

              </div>

            </section>

            {/* Order Date */}

            <section className="order-details-card">

              <div className="order-date-row">

                <span>
                  Order Date
                </span>

                <strong>
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </strong>

              </div>

            </section>

          </div>

          {/* Order Summary */}

          <aside className="order-details-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">
              <span>
                Subtotal
              </span>

              <span>
                {
                  Number(
                    order.subtotal
                  ).toFixed(2)
                } ETB
              </span>
            </div>

            <div className="summary-row">
              <span>
                Delivery
              </span>

              <span>
                {
                  Number(
                    order.delivery_fee
                  ).toFixed(2)
                } ETB
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>
                Total
              </span>

              <strong>
                {
                  Number(
                    order.total
                  ).toFixed(2)
                } ETB
              </strong>
            </div>

            {order.status === 'pending' && (
              <button
                className="cancel-order-button"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                <XCircle size={18} />

                {cancelling
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </button>
            )}

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

export default OrderDetails;