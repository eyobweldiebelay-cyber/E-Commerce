import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tags,
    Users,
    ShoppingBag,
    CreditCard,
    LogOut
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

function AdminSidebar() {

    const { logout } = useAuth();

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/admin',
            icon: LayoutDashboard
        },
        {
            name: 'Products',
            path: '/admin/products',
            icon: Package
        },
        {
            name: 'Categories',
            path: '/admin/categories',
            icon: Tags
        },
        {
            name: 'Customers',
            path: '/admin/customers',
            icon: Users
        },
        {
            name: 'Orders',
            path: '/admin/orders',
            icon: ShoppingBag
        },
        {
            name: 'Payments',
            path: '/admin/payments',
            icon: CreditCard
        }
    ];

    return (
        <aside className="admin-sidebar">

            <div className="admin-sidebar-logo">
                <div className="admin-logo-icon">
                    🛍
                </div>

                <div>
                    <h2>E-Shop</h2>
                    <span>ADMIN PANEL</span>
                </div>
            </div>


            <nav className="admin-sidebar-menu">

                <p className="admin-menu-title">
                    MAIN MENU
                </p>

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin/dashboard'}
                            className={({ isActive }) =>
                                isActive
                                    ? 'admin-nav-link active'
                                    : 'admin-nav-link'
                            }
                        >
                            <Icon size={19} />

                            <span>
                                {item.name}
                            </span>
                        </NavLink>
                    );

                })}

            </nav>


            <div className="admin-sidebar-bottom">

                <button
                    className="admin-logout-button"
                    onClick={logout}
                >
                    <LogOut size={19} />

                    <span>
                        Logout
                    </span>
                </button>

            </div>

        </aside>
    );
}

export default AdminSidebar;