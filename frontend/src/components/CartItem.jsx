import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const {
    updateQuantity,
    removeFromCart
  } = useCart();

  // Product information can come directly from the item
  // or from item.product depending on the backend response.
  const product = item.product || item;

  const productId = item.product_id || product.id;
  const quantity = Number(item.quantity || 1);
  const price = Number(item.price || product.price || 0);

  const total = price * quantity;

  // Decrease quantity
  const handleDecrease = async () => {
    if (quantity <= 1) {
      return;
    }

    try {
      await updateQuantity(productId, quantity - 1);
    } catch (error) {
      console.error('Failed to update quantity:', error);

      alert(
        error.response?.data?.message ||
        'Failed to update quantity'
      );
    }
  };

  // Increase quantity
  const handleIncrease = async () => {
    try {
      await updateQuantity(productId, quantity + 1);
    } catch (error) {
      console.error('Failed to update quantity:', error);

      alert(
        error.response?.data?.message ||
        'Failed to update quantity'
      );
    }
  };

  // Remove product
  const handleRemove = async () => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove product:', error);

      alert(
        error.response?.data?.message ||
        'Failed to remove product'
      );
    }
  };

  return (
    <div className="cart-item">

      {/* Product */}
      <div className="cart-item-product">

        <div className="cart-item-image">
          {product.image ? (
            <img
              src={
                product.image.startsWith('http')
                  ? product.image
                  : `http://localhost:8800/uploads/products/${product.image}`
              }
              alt={product.name}
            />
          ) : (
            <div className="no-image">
              No Image
            </div>
          )}
        </div>

        <div className="cart-item-info">
          <h3>{product.name}</h3>

          <p>
            ${price.toFixed(2)}
          </p>
        </div>

      </div>


      {/* Quantity */}
      <div className="cart-item-quantity">

        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        <span>
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>

      </div>


      {/* Total */}
      <div className="cart-item-total">
        ${total.toFixed(2)}
      </div>


      {/* Remove */}
      <button
        type="button"
        className="cart-item-remove"
        onClick={handleRemove}
        aria-label="Remove product"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}

export default CartItem;