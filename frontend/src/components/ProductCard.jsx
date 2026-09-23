import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function ProductCard({ product }) {
  const price = Number(product.price || 2300);

  return (
    <div className="product-card">

      {/* Product Image */}
      <Link
        to={`/products/${product.id}`}
        className="product-card-image"
      >
        {product.image ? (
          <img
            src={
              product.image.startsWith('http')
                ? product.image
                : `https://e-commerce-q8od.onrender.com/uploads/products/${product.image}`
            }
            alt={product.name}
          />
        ) : (
          <div className="product-no-image">
            No Image
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="product-card-body">

        <h3 className="product-card-name">
          {product.name}
        </h3>

        <div className="product-rating">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <small>(5.0)</small>
        </div>

        <div className="product-card-price">
          {price.toFixed(2)} ETB
        </div>

        <div className="product-card-actions">

          <Link
            to={`/products/${product.id}`}
            className="product-details-button"
          >
            View Details
          </Link>

          <button
            className="product-add-button"
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