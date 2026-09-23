import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';

import api from '../../api/api';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/orders');

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load orders:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Failed to load orders.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `order-status-badge ${status}`;
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="container">
          <div className="page-loading">
            Loading orders...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="container">
          <div className="products-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="container">

        <div className="orders-header">
          <div>
            <h2>I have Ordered This Items </h2>
            
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">

            <Package size={55} />

            <h2>No Orders Yet</h2>

            <p>
              You have not placed any orders yet.
            </p>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Start Shopping
            </Link>

          </div>
        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.id}
              >

                <div className="order-card-header">

                  <div>
                    <span className="order-label">
                      Order
                    </span>

                    <strong>
                      #{order.id}
                    </strong>
                  </div>

                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="order-card-body">

                  <div className="order-info">

                    <span>
                      Date
                    </span>

                    <strong>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </strong>

                  </div>

                  <div className="order-info">

                    <span>
                      Items Total
                    </span>

                    <strong>
                      {Number(
                        order.subtotal
                      ).toFixed(2)} ETB
                    </strong>

                  </div>

                  <div className="order-info">

                    <span>
                      Delivery
                    </span>

                    <strong>
                      {Number(
                        order.delivery_fee
                      ).toFixed(2)} ETB
                    </strong>

                  </div>

                  <div className="order-info">

                    <span>
                      Total
                    </span>

                    <strong className="order-total">
                      {Number(
                        order.total
                      ).toFixed(2)} ETB
                    </strong>

                  </div>

                </div>

                <div className="order-card-footer">

                  <Link
                    to={`/orders/${order.id}`}
                    className="view-order-button"
                  >
                    <Eye size={17} />
                    View Details
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}

export default MyOrders;