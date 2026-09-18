import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert('Product added to cart');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Please login to add products to cart');
    }
  };

  return (
    <div className="product-card">

      <Link to={`/products/${product.id}`} className="product-image-link">
        <div className="product-image">
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
      </Link>

      <div className="product-card-content">

        <h3>
          {product.name}
        </h3>

        <p className="product-price">
          ${Number(product.price).toFixed(2)}
        </p>

        <div className="product-card-actions">

          <Link
            to={`/products/${product.id}`}
            className="view-product-button"
          >
            View Details
          </Link>

          <button
            className="add-cart-button"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={17} />
            Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;