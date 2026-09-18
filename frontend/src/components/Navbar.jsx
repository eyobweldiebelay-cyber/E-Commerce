import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Search
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          E-Shop
        </Link>

        {/* Main Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>

        {/* Right Side */}
        <div className="nav-actions">

          {/* Search */}
          <Link to="/products" className="nav-icon">
            <Search size={21} />
          </Link>

          {/* Logged-in Customer */}
          {user && (
            <>
              <Link to="/favorites" className="nav-icon">
                <Heart size={21} />
              </Link>

              <Link to="/cart" className="nav-icon cart-icon">
                <ShoppingCart size={21} />

                {itemCount > 0 && (
                  <span className="cart-count">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="nav-icon">
                <User size={21} />
              </Link>

              {/* Admin */}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard">
                  Admin
                </Link>
              )}

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}

          {/* Guest */}
          {!user && (
            <>
              <Link to="/login">Login</Link>

              <Link
                to="/register"
                className="register-link"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;