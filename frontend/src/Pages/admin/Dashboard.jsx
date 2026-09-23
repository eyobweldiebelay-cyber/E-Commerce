import { useEffect, useState } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

import api from '../../api/api';
import AdminSidebar from './AdminSidebar';

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    payments: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        productsResponse,
        customersResponse,
        ordersResponse,
        paymentsResponse
      ] = await Promise.all([
        api.get('/products'),
        api.get('/users/customers'),
        api.get('/orders/admin/all'),
        api.get('/payments/admin/all')
      ]);

      const products =
        productsResponse.data.products ||
        productsResponse.data ||
        [];

      const customers =
        customersResponse.data.customers ||
        customersResponse.data ||
        [];

      const orders =
        ordersResponse.data.orders ||
        ordersResponse.data ||
        [];

      const payments =
        paymentsResponse.data.payments ||
        paymentsResponse.data ||
        [];

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        customers: Array.isArray(customers) ? customers.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        payments: Array.isArray(payments) ? payments.length : 0
      });

    } catch (error) {
      console.error('Failed to load dashboard:', error);

      setError(
        error.response?.data?.message ||
        'Failed to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">

      {/* ADMIN SIDEBAR */}
      <AdminSidebar />

      {/* MAIN ADMIN CONTENT */}
      <main className="admin-main">

        <div className="admin-container">

          <div className="admin-page-header">

            <div>

              <span className="admin-label">
                ADMIN PANEL
              </span>

              <h1>
                Dashboard
              </h1>

              <p>
                Manage your store and monitor activity.
              </p>

            </div>

          </div>


          {loading && (
            <div className="admin-loading">
              Loading dashboard...
            </div>
          )}


          {error && !loading && (
            <div className="admin-error">
              {error}
            </div>
          )}


          {!loading && !error && (
            <div className="dashboard-stats">

              {/* PRODUCTS */}

              <div className="dashboard-stat-card">

                <div className="stat-icon">
                  <Package size={24} />
                </div>

                <div>
                  <span>
                    Products
                  </span>

                  <strong>
                    {stats.products}
                  </strong>
                </div>

              </div>


              {/* CUSTOMERS */}

              <div className="dashboard-stat-card">

                <div className="stat-icon">
                  <Users size={24} />
                </div>

                <div>
                  <span>
                    Customers
                  </span>

                  <strong>
                    {stats.customers}
                  </strong>
                </div>

              </div>


              {/* ORDERS */}

              <div className="dashboard-stat-card">

                <div className="stat-icon">
                  <ShoppingCart size={24} />
                </div>

                <div>
                  <span>
                    Orders
                  </span>

                  <strong>
                    {stats.orders}
                  </strong>
                </div>

              </div>


              {/* PAYMENTS */}

              <div className="dashboard-stat-card">

                <div className="stat-icon">
                  <CreditCard size={24} />
                </div>

                <div>
                  <span>
                    Payments
                  </span>

                  <strong>
                    {stats.payments}
                  </strong>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;