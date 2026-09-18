import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Fallback image if category.image is empty or broken
  const defaultImage = 'https://via.placeholder.com/150';

  return (
    <Link to={`/products?category=${category.id}`} className="category-card">
      <div className="category-image-container">
        <img 
          src={category.image || defaultImage} 
          alt={category.name} 
          className="category-img" 
        />
      </div>
      <h3 className="category-name">{category.name}</h3>
    </Link>
  );
};

export default CategoryCard;