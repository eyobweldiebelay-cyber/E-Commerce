import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import api from '../api/api';
import ProductCard from '../components/ProductCard';

function Products() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/products');

      const productData =
        response.data.products ||
        response.data ||
        [];

      if (!Array.isArray(productData)) {
        setProducts([]);
        return;
      }

      let filteredProducts = productData;

      // CATEGORY FILTER
      if (category) {
        filteredProducts = filteredProducts.filter((product) =>
          String(product.category_name || '')
            .toLowerCase()
            .includes(category.toLowerCase())
        );
      }

      // SEARCH FILTER
      if (search) {
        const searchValue = search.toLowerCase();

        filteredProducts = filteredProducts.filter(
          (product) => {

            const productName =
              String(product.name || '').toLowerCase();

            const description =
              String(product.description || '').toLowerCase();

            const categoryName =
              String(product.category_name || '').toLowerCase();

            return (
              productName.includes(searchValue) ||
              description.includes(searchValue) ||
              categoryName.includes(searchValue)
            );
          }
        );
      }

      setProducts(filteredProducts);

    } catch (error) {
      console.error(
        'Failed to load products:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Failed to load products.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // PAGE TITLE
  // --------------------------------

  const getPageTitle = () => {

    if (search) {
      return `Search Results`;
    }

    if (category) {
      return category;
    }

    return 'All Products';
  };

  return (
    <main className="products-page">

      <div className="container">

        {/* PAGE HEADER */}
        <div className="products-header">

          <div>

            <span className="products-label">
              E-SHOP COLLECTION
            </span>

            <h1>
              {getPageTitle()}
            </h1>

            <p>
              {search
                ? `Products matching "${search}"`
                : category
                  ? `Explore our ${category.toLowerCase()} collection.`
                  : 'Discover products for you.'}
            </p>

          </div>

          <div className="products-count">
            {products.length}{' '}
            {products.length === 1
              ? 'Product'
              : 'Products'}
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="page-loading">
            Loading products...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="products-error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          products.length === 0 && (

            <div className="empty-products">

              <h2>
                No products found
              </h2>

              <p>
                {search
                  ? `We couldn't find any products matching "${search}".`
                  : 'There are no products available in this category.'}
              </p>

              <Link
                to="/products"
                className="view-all-products-button"
              >
                View All Products
              </Link>

            </div>
          )}

        {/* PRODUCTS */}
        {!loading &&
          !error &&
          products.length > 0 && (

            <div className="products-grid">

              {products.map((product) => (

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