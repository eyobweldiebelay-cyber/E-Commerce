import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';

import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

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

  return (
    <main className="product-details-page">

      <div className="container">

        <div className="product-details">

          {/* Product Image */}
          <div className="product-details-image">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="no-image">
                No Image
              </div>
            )}

          </div>

          {/* Product Information */}
          <div className="product-details-info">

            <p className="product-category">
              {product.category_name || 'Product'}
            </p>

            <h1>{product.name}</h1>

            <p className="product-details-price">
              {Number(product.price).toFixed(2)} ETB
            </p>

            <p className="product-stock">
              {stock > 0
                ? `${stock} in stock`
                : 'Out of stock'}
            </p>

            <div className="product-description">

              <h3>Description</h3>

              <p>
                {product.description ||
                  'No description available.'}
              </p>

            </div>

            {/* Quantity */}
            {stock > 0 && (
              <div className="quantity-section">

                <h3>Quantity</h3>

                <div className="quantity-control">

                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={17} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= stock}
                  >
                    <Plus size={17} />
                  </button>

                </div>

              </div>
            )}

            {/* Actions */}
            <div className="product-details-actions">

              <button
                className="favorite-button"
                onClick={() => alert('Favorites will be connected next.')}
              >
                <Heart size={19} />
                Favorite
              </button>

              <button
                className="add-details-cart-button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
              >
                <ShoppingCart size={19} />

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