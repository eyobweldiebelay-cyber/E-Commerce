import { useEffect, useState } from 'react';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../api/api';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/users/customers');

            setCustomers(response.data.customers || []);

        } catch (error) {
            console.error('Failed to load customers:', error);

            setError(error.response?.data?.message ||'Failed to load customers.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-page">
            <div className="admin-container">

                <div className="admin-page-header">
                    <div>
                        <span className="admin-label">
                            ADMIN PANEL
                        </span>

                        <h1>Customers</h1>

                        <p>
                            View and manage customers registered in your store.
                        </p>
                    </div>

                    <div className="admin-page-count">
                        <Users size={20} />
                        <span>{customers.length} Customers</span>
                    </div>
                </div>


                {loading && (
                    <div className="admin-loading">
                        Loading customers...
                    </div>
                )}


                {error && !loading && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}


                {!loading && !error && customers.length === 0 && (
                    <div className="admin-empty">
                        <Users size={48} />

                        <h2>No customers yet</h2>

                        <p>
                            Customers will appear here after they register.
                        </p>
                    </div>
                )}


                {!loading && !error && customers.length > 0 && (
                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>

                            <tbody>

                                {customers.map((customer) => (
                                    <tr key={customer.id}>

                                        <td>
                                            #{customer.id}
                                        </td>

                                        <td>
                                            <div className="customer-name">
                                                <div className="customer-avatar">
                                                    <Users size={18} />
                                                </div>

                                                <strong>
                                                    {customer.name}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="customer-info">
                                                <Mail size={16} />
                                                <span>
                                                    {customer.email}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="customer-info">
                                                <Phone size={16} />
                                                <span>
                                                    {customer.phone || '—'}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="customer-info">
                                                <MapPin size={16} />
                                                <span>
                                                    {customer.address || '—'}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="role-badge">
                                                {customer.role}
                                            </span>
                                        </td>

                                        <td>
                                            {customer.created_at
                                                ? new Date(
                                                    customer.created_at
                                                ).toLocaleDateString()
                                                : '—'}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>
        </main>
    );
}

export default Customers;