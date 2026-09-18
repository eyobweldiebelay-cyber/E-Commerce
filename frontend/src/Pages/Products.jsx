import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import api from '../api/api';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/products');

      const data = response.data.products || response.data;

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load products:', error);

      setError(
        error.response?.data?.message ||
        'Failed to load products'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = category
    ? products.filter((product) => {
        const productCategory =
          product.category_name ||
          product.category ||
          product.category_slug;

        return String(productCategory).toLowerCase() ===
          String(category).toLowerCase();
      })
    : products;

  return (
    <main className="products-page">

      <div className="container">

        <div className="products-header">

          <div>
            <h1>
              {category
                ? `${category} Products`
                : 'All Products'}
            </h1>

            <p>
              Discover products you will love.
            </p>
          </div>

        </div>

        {loading && (
          <div className="page-loading">
            Loading products...
          </div>
        )}

        {!loading && error && (
          <div className="products-error">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="empty-products">
            <h2>No products found</h2>
            <p>
              There are no products available in this category.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="product-grid">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Products;