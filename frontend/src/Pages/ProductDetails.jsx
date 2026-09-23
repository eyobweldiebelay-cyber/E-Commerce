import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Check
} from 'lucide-react';

import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    api
      .get(`/favorites/check/${id}`)
      .then((response) => {
        setIsFavorite(response.data.isFavorite);
      })
      .catch((error) => {
        console.error('Failed to check favorite:', error);
      });
  }, [id, user]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/products/${id}`);

      setProduct(response.data.product || response.data);
    } catch (error) {
      console.error('Failed to load product:', error);

      setError(
        error.response?.data?.message ||
        'Failed to load product'
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < Number(product.stock)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('Please login to use favorites.');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${product.id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', {
          productId: product.id
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Favorite action failed:', error);

      alert(
        error.response?.data?.message ||
        'Failed to update favorite.'
      );
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add products to cart.');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      alert('Product added to cart');
    } catch (error) {
      console.error('Failed to add product:', error);

      alert(
        error.response?.data?.message ||
        'Failed to add product to cart'
      );
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="container">
          <div className="page-loading">
            Loading product...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-details-page">
        <div className="container">
          <div className="products-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="container">
          <div className="empty-products">
            <h2>Product not found</h2>

            <Link to="/products">
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const stock = Number(product.stock);

  /*
    Create the correct image URL.

    Database:
    product.image = "jacket.jpg"

    Browser:
    https://e-commerce-q8od.onrender.com/uploads/products/jacket.jpg
  */
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `https://e-commerce-q8od.onrender.com/uploads/products/${product.image}`
    : null;

  return (
    <main className="product-details-page">

      <div className="container">

        {/* Back Button */}
        <Link
          to="/products"
          className="product-back-link"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="product-details-card">

          {/* =========================
              LEFT - PRODUCT IMAGE
          ========================== */}
          <div className="product-details-gallery">

            <div className="product-image-wrapper">

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="product-details-main-image"
                />
              ) : (
                <div className="product-details-no-image">
                  No Image Available
                </div>
              )}

            </div>

          </div>

          {/* =========================
              RIGHT - PRODUCT INFO
          ========================== */}
          <div className="product-details-info">

            {/* Category */}
            <span className="product-category-badge">
              {product.category_name || 'Product'}
            </span>

            {/* Product Name */}
            <h1 className="product-details-title">
              {product.name}
            </h1>

            {/* Price */}
            <div className="product-details-price">
              {Number(product.price).toFixed(2)}
              <span> ETB</span>
            </div>

            {/* Stock */}
            <div
              className={
                stock > 0
                  ? 'product-stock available'
                  : 'product-stock unavailable'
              }
            >
              {stock > 0 ? (
                <>
                  <Check size={17} />
                  {stock} in stock
                </>
              ) : (
                'Out of stock'
              )}
            </div>

            {/* Description */}
            <div className="product-description">

              <h3>Description</h3>

              <p>
                {product.description ||
                  'No description available for this product.'}
              </p>

            </div>

            {/* Quantity */}
            {stock > 0 && (
              <div className="quantity-section">

                <h3>Quantity</h3>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= stock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>

                </div>

              </div>
            )}

            {/* Actions */}
            <div className="product-details-actions">

              <button
                type="button"
                className={`favorite-button ${
                  isFavorite ? 'favorite-active' : ''
                }`}
                onClick={handleFavorite}
              >
                <Heart
                  size={19}
                  fill={
                    isFavorite
                      ? 'currentColor'
                      : 'none'
                  }
                />

                {isFavorite
                  ? 'Remove Favorite'
                  : 'Add to Favorites'}
              </button>

              <button
                type="button"
                className="add-details-cart-button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
              >
                <ShoppingCart size={20} />

                {stock > 0
                  ? 'Add to Cart'
                  : 'Out of Stock'}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;