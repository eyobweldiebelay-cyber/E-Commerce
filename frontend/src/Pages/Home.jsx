import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import api from '../api/api';

const Home = () => {
 const [categories, setCategories] = useState([
  { id: 1, name: 'Men Fashion', image: '' },
  { id: 2, name: 'Electronics', image: '' }
]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((response) => {
        console.log('Categories from API:', response.data); // Check F12 Console
        // Handle both direct array or wrapped object responses
        const dataArray = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
        
        setCategories(dataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading categories:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading store...</div>;
  }

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <div className="hero-section">
        <h1>SHOP WHAT YOU LOVE</h1>
        <p>Fashion • Electronics • Quality Products</p>
        <Link to="/products" className="shop-now-btn">SHOP NOW</Link>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>CATEGORIES</h2>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;