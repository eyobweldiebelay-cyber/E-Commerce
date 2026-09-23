import { useEffect, useState } from 'react';
import api from '../../api/api';

function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPayments = async () => {
        try {
            setLoading(true);

            const response = await api.get('/payments/admin/all');
            console.log(response.data);

            setPayments(response.data || []);
            setError('');
        } catch (error) {
            console.error('Get payments error:', error);

            setError(
                error.response?.data?.message ||
                'Failed to load payments'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="page-loading">
                Loading payments...
            </div>
        );
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">
                <div>
                    <h1>Payments</h1>
                    <p>View customer payment transactions</p>
                </div>

                <button
                    className="admin-refresh-btn"
                    onClick={fetchPayments}
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
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Transaction ID</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {payments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="empty-table"
                                >
                                    No payments found
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id}>

                                    <td>
                                        #{payment.id}
                                    </td>

                                    <td>
                                        #{payment.order_id}
                                    </td>

                                    <td>
                                        {payment.customer_name ||
                                            payment.username ||
                                            payment.name ||
                                            'N/A'}
                                    </td>

                                    <td>
                                        {Number(
                                            payment.amount || 0
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        {payment.method || 'N/A'}
                                    </td>

                                    <td>
                                        {payment.transaction_id || 'N/A'}
                                    </td>

                                    <td>
                                        <span
                                            className={`order-status ${payment.status}`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>

                                    <td>
                                        {payment.paid_at
                                            ? new Date(
                                                payment.paid_at
                                            ).toLocaleDateString()
                                            : 'N/A'}
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

export default Payments;