import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

import api from '../api/api';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import CarouselEffect from '../components/Carousel/CarouselEffect';

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // =========================================
  // LOAD CATEGORIES
  // =========================================

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');

      setCategories(
        response.data.categories || []
      );

    } catch (error) {
      console.error(
        'Failed to load categories:',
        error
      );
    } finally {
      setLoadingCategories(false);
    }
  };


  // =========================================
  // LOAD PRODUCTS
  // =========================================

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');

      const data =
        response.data.products ||
        response.data;

      setProducts(
        Array.isArray(data)
          ? data.slice(0, 8)
          : []
      );

    } catch (error) {
      console.error(
        'Failed to load products:',
        error
      );
    } finally {
      setLoadingProducts(false);
    }
  };


  return (
    <main className="home-page">

      {/* =====================================
          HERO CAROUSEL
      ====================================== */}

      <CarouselEffect />


      {/* =====================================
          SHOP BY CATEGORY
      ====================================== */}

      <section className="home-section categories-section">

        <div className="container">

          <div className="section-header">

            <div className="section-heading">

              <span className="section-label">
                EXPLORE OUR STORE
              </span>

              <h2>
                Shop by Category
              </h2>

              <p>
                Find what you need from our
                collection of products.
              </p>

            </div>


            <Link
              to="/products"
              className="section-link"
            >
              View all
              <ArrowRight size={17} />
            </Link>

          </div>


          {/* CATEGORY CONTENT */}

          {loadingCategories ? (

            <div className="page-loading">
              Loading categories...
            </div>

          ) : categories.length === 0 ? (

            <div className="empty-products">

              <ShoppingBag size={32} />

              <h3>
                No categories available
              </h3>

              <p>
                Categories will appear here
                when they are added.
              </p>

            </div>

          ) : (

            <div className="category-grid">

              {categories.map((category) => (

                <CategoryCard
                  key={category.id}
                  category={category}
                />

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================
          FEATURED PRODUCTS
      ====================================== */}

      <section className="home-section products-section">

        <div className="container">

          <div className="section-header">

            <div className="section-heading">

              <span className="section-label">
                OUR COLLECTION
              </span>

              <h2>
                Everything You Need,
                All in One Place
              </h2>

              <p>
                Browse our latest products
                and choose what you love.
              </p>

            </div>


            <Link
              to="/products"
              className="section-link"
            >
              Shop Now
              <ArrowRight size={17} />
            </Link>

          </div>


          {/* PRODUCT CONTENT */}

          {loadingProducts ? (

            <div className="page-loading">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="empty-products">

              <ShoppingBag size={32} />

              <h3>
                No products available
              </h3>

              <p>
                Products will appear here
                when they are added.
              </p>

            </div>

          ) : (

            <div className="product-grid">

              {products.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Home;