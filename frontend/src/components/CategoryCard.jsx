import { Link } from 'react-router-dom';
import {
  Shirt,
  Smartphone,
  ShoppingBag
} from 'lucide-react';

function CategoryCard({ category }) {

  const getCategoryIcon = () => {
    const name = category.name.toLowerCase();

    if (
      name.includes('electronics') ||
      name.includes('electroncies')
    ) {
      return <Smartphone size={42} />;
    }

    if (name.includes('women')) {
      return <ShoppingBag size={42} />;
    }

    return <Shirt size={42} />;
  };

  return (
    <section className="category_container">

      <Link
        to={`/products?category=${encodeURIComponent(category.name)}`}
        className="category-card"
      >

        <div className="category-card-icon">

          {category.image ? (
            <img
              src={
                category.image.startsWith('http')
                  ? category.image
                  : `https://e-commerce-q8od.onrender.com/uploads/categories/${category.image}`
              }
              alt={category.name}
            />
          ) : (
            getCategoryIcon()
          )}

        </div>

        <div className="category-card-content">

          <h3>{category.name}</h3>

          <span>
            Explore Products →
          </span>

        </div>

      </Link>

    </section>
  );
}

export default CategoryCard;