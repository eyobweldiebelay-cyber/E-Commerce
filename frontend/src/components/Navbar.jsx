import { useEffect, useState } from 'react';
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
import api from '../api/api';

function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);


  /*
  ==========================================
  SEARCH PRODUCTS
  ==========================================
  */

  useEffect(() => {
    const searchProducts = async () => {

      const value = searchText.trim().toLowerCase();

      if (!value) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);

        const response = await api.get('/products');

        const products =
          response.data.products ||
          response.data ||
          [];

        if (!Array.isArray(products)) {
          setSearchResults([]);
          return;
        }

        const filtered = products
          .filter((product) => {

            const name =
              String(product.name || '').toLowerCase();

            const description =
              String(product.description || '').toLowerCase();

            const category =
              String(product.category_name || '').toLowerCase();

            return (
              name.includes(value) ||
              description.includes(value) ||
              category.includes(value)
            );
          })
          .slice(0, 5);

        setSearchResults(filtered);

      } catch (error) {
        console.error(
          'Failed to search products:',
          error
        );

        setSearchResults([]);

      } finally {
        setSearchLoading(false);
      }
    };


    const timer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(timer);

  }, [searchText]);


  /*
  ==========================================
  LOGOUT
  ==========================================
  */

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  /*
  ==========================================
  SEARCH SUBMIT
  ==========================================
  */

  const handleSearch = (e) => {

    e.preventDefault();

    const value = searchText.trim();

    if (!value) {
      navigate('/products');
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );
  };


  /*
  ==========================================
  PRODUCT IMAGE
  ==========================================
  */

  const getProductImage = (product) => {

    if (!product.image) {
      return null;
    }

    if (product.image.startsWith('http')) {
      return product.image;
    }

    return `http://localhost:8800/uploads/products/${product.image}`;
  };


  /*
  ==========================================
  CLICK SEARCH RESULT
  ==========================================
  */

  const handleProductClick = (productId) => {

    setSearchText('');
    setSearchResults([]);

    navigate(`/products/${productId}`);
  };


  return (
    <header className="navbar">

      <div className="navbar-container">


        {/* Logo */}

        <Link
          to="/"
          className="logo"
        >
          Well Come To E-Shop
        </Link>


        {/* Main Navigation */}

        <nav className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

        </nav>


        {/* =================================
            SEARCH
        ================================= */}

        <div className="navbar-search-wrapper">

          <form
            className="navbar-search-form"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <button
              type="submit"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

          </form>


          {/* Search Results Dropdown */}

          {searchText.trim() !== '' && (

            <div className="search-results-dropdown">


              {/* Loading */}

              {searchLoading && (

                <div className="search-message">
                  Searching products...
                </div>

              )}


              {/* No Results */}

              {!searchLoading &&
                searchResults.length === 0 && (

                  <div className="search-message">

                    <Search size={20} />

                    <span>
                      No products found
                    </span>

                  </div>

                )}


              {/* Results */}

              {!searchLoading &&
                searchResults.length > 0 && (

                  <>

                    <div className="search-results-title">
                      Products
                    </div>


                    {searchResults.map((product) => (

                      <button
                        type="button"
                        key={product.id}
                        className="search-product-card"
                        onClick={() =>
                          handleProductClick(product.id)
                        }
                      >

                        <div className="search-product-image">

                          {getProductImage(product) ? (

                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                            />

                          ) : (

                            <div className="search-no-image">
                              No Image
                            </div>

                          )}

                        </div>


                        <div className="search-product-info">

                          <h4>
                            {product.name}
                          </h4>

                          <p>
                            {product.category_name ||
                              'Product'}
                          </p>

                          <strong>
                            {Number(
                              product.price
                            ).toFixed(2)} ETB
                          </strong>

                        </div>

                      </button>

                    ))}


                    {/* View all */}

                    <button
                      type="button"
                      className="search-view-all"
                      onClick={() => {

                        navigate(
                          `/products?search=${encodeURIComponent(
                            searchText.trim()
                          )}`
                        );

                        setSearchText('');
                        setSearchResults([]);

                      }}
                    >
                      View all search results →
                    </button>

                  </>

                )}

            </div>

          )}

        </div>


        {/* =================================
            RIGHT SIDE
        ================================= */}

        <div className="nav-actions">


          {/* Logged-in Customer */}

          {user && (
            <>


              <Link
                to="/favorites"
                className="nav-icon"
                aria-label="Favorites"
              >
                <Heart size={21} />
              </Link>


              <Link
                to="/cart"
                className="nav-icon cart-icon"
                aria-label="Cart"
              >

                <ShoppingCart size={21} />

                {itemCount > 0 && (
                  <span className="cart-count">
                    {itemCount}
                  </span>
                )}

              </Link>


              <Link
                to="/profile"
                className="nav-icon"
                aria-label="Profile"
              >
                <User size={21} />
              </Link>


              {/* Admin */}

              {user.role === 'admin' && (

                <Link
                  to="/admin"
                  className="admin-link"
                >
                  Admin
                </Link>

              )}


              {/* Logout */}

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >

                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </>
          )}


          {/* Guest */}

          {!user && (
            <>

              <Link to="/login">
                Login
              </Link>

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