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

        <Link to="/" className="logo">
          E-Shop
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/products?category=men">Men</Link>
          <Link to="/products?category=women">Women</Link>
          <Link to="/products?category=electronics">
            Electronics
          </Link>
        </nav>

        <div className="nav-actions">

          <Link to="/products" className="nav-icon">
            <Search size={21} />
          </Link>

          {user && (
            <Link to="/favorites" className="nav-icon">
              <Heart size={21} />
            </Link>
          )}

          {user && (
            <Link to="/cart" className="nav-icon cart-icon">
              <ShoppingCart size={21} />

              {itemCount > 0 && (
                <span className="cart-count">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" className="nav-icon">
                <User size={21} />
              </Link>

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
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-link">
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