import { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '../../api/api';
import { useCart } from '../../context/CartContext';

function Favorites() {
  const { addToCart } = useCart();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/favorites');

      setFavorites(
        Array.isArray(response.data)
          ? response.data
          : response.data.favorites || []
      );
    } catch (error) {
      console.error(
        'Failed to load favorites:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Failed to load favorites.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/favorites/${productId}`);

      setFavorites((current) =>
        current.filter(
          (item) => item.product_id !== productId
        )
      );
    } catch (error) {
      console.error(
        'Failed to remove favorite:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Failed to remove favorite.'
      );
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);

      alert('Product added to cart');
    } catch (error) {
      console.error(
        'Failed to add product:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Failed to add product to cart.'
      );
    }
  };

  if (loading) {
    return (
      <main className="favorites-page">
        <div className="container">
          <div className="page-loading">
            Loading favorites...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="favorites-page">
        <div className="container">
          <div className="products-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <div className="container">

        <div className="favorites-header">
          <div>
            <h1>My Favorites</h1>
            <p>
              {favorites.length}{' '}
              {favorites.length === 1
                ? 'product'
                : 'products'}
            </p>
          </div>

          <Heart size={28} />
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">

            <Heart size={55} />

            <h2>
              No Favorites Yet
            </h2>

            <p>
              Save products you love and
              find them here later.
            </p>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Browse Products
            </Link>

          </div>
        ) : (

          <div className="favorites-grid">

            {favorites.map((product) => (

              <div
                className="favorite-card"
                key={product.id}
              >

                <Link
                  to={`/products/${product.product_id}`}
                  className="favorite-image"
                >
                  {product.image ? (
                    <img
                      src={`http://localhost:8800/uploads/products/${product.image}`}
                      alt={product.name}
                    />
                  ) : (
                    <span>
                      No Image
                    </span>
                  )}
                </Link>

                <div className="favorite-content">

                  <h3>
                    {product.name}
                  </h3>

                  <p className="favorite-price">
                    {Number(product.price).toFixed(2)} ETB
                  </p>

                  <div className="favorite-actions">

                    <button
                      className="favorite-cart-button"
                      onClick={() =>
                        handleAddToCart(
                          product.product_id
                        )
                      }
                      disabled={
                        product.stock <= 0 ||
                        product.status !== 'active'
                      }
                    >
                      <ShoppingCart size={16} />

                      {product.stock > 0
                        ? 'Add to Cart'
                        : 'Out of Stock'}
                    </button>

                    <button
                      className="favorite-remove-button"
                      onClick={() =>
                        handleRemove(
                          product.product_id
                        )
                      }
                      title="Remove favorite"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}

export default Favorites;