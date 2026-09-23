import { useEffect, useState } from 'react';
import api from '../../api/api';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await api.get('/orders/admin/all');
            console.log(response);

            setOrders(response.data || []);
            setError('');
        } catch (error) {
            console.error('Get orders error:', error);

            setError(
                error.response?.data?.message ||
                'Failed to load orders'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/admin/${id}/status`, {
                status
            });

            alert('Order status updated');

            fetchOrders();
        } catch (error) {
            console.error('Update order status error:', error);

            alert(
                error.response?.data?.message ||
                'Failed to update order status'
            );
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">
                <div>
                    <h1>Orders</h1>
                    <p>Manage customer orders</p>
                </div>

                <button
                    className="admin-refresh-btn"
                    onClick={fetchOrders}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}

            <div className="admin-table-container">

                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="empty-table">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>

                                    <td>
                                        #{order.id}
                                    </td>

                                    <td>
                                        {order.name || 'N/A'}
                                    </td>

                                    <td>
                                        {order.phone || 'N/A'}
                                    </td>

                                    <td>
                                        {order.address || 'N/A'}
                                    </td>

                                    <td>
                                        {Number(order.total || 0).toFixed(2)}
                                    </td>

                                    <td>
                                        <span className={`order-status ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>

                                    <td>
                                        {order.created_at
                                            ? new Date(order.created_at).toLocaleDateString()
                                            : 'N/A'}
                                    </td>

                                    <td>

                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>

                                            <option value="processing">
                                                Processing
                                            </option>

                                            <option value="shipped">
                                                Shipped
                                            </option>

                                            <option value="delivered">
                                                Delivered
                                            </option>

                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>

                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Orders;