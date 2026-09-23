import { useEffect, useState } from 'react';
import api from '../../api/api';
import {
    Package,
    Plus,
    Edit,
    Trash2,
    X
} from 'lucide-react';



function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null
    });

    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/products');

            const data =
                response.data.products ||
                response.data ||
                [];

            setProducts(
                Array.isArray(data) ? data : []
            );

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

    // =========================
    // LOAD CATEGORIES
    // =========================

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
             const data =
                response.data.categories ||
                response.data ||
                [];

            setCategories(
                Array.isArray(data) ? data : []
            );

        } catch (error) {
            console.error(
                'Failed to load categories:',
                error
            );
        }
    };

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    // =========================
    // IMAGE CHANGE
    // =========================

    const handleImageChange = (event) => {
        setFormData((current) => ({
            ...current,
            image: event.target.files[0]
        }));
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {
        setEditingProduct(null);

        setFormData({
            category_id: '',
            name: '',
            description: '',
            price: '',
            stock: '',
            image: null
        });

        setError('');
        setShowForm(true);
    };

    // =========================
    // OPEN EDIT FORM
    // =========================

    const openEditForm = (product) => {
        setEditingProduct(product);

        setFormData({
            category_id: product.category_id || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
            image: null
        });

        setError('');
        setShowForm(true);
    };

    // =========================
    // CLOSE FORM
    // =========================

    const closeForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingProduct(null);
        setError('');
    };

    // =========================
    // SUBMIT FORM
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError('');

            // FormData is required because
            // product image uses multer.
            const data = new FormData();

            data.append(
                'category_id',
                formData.category_id
            );

            data.append(
                'name',
                formData.name.trim()
            );

            data.append(
                'description',
                formData.description.trim()
            );

            data.append(
                'price',
                formData.price
            );

            data.append(
                'stock',
                formData.stock
            );

            // Only send image if user selected one
            if (formData.image) {
                data.append(
                    'image',
                    formData.image
                );
            }

            // =========================
            // CREATE
            // =========================

            if (!editingProduct) {
                const response = await api.post(
                    '/products',
                    data
                );

                const newProduct =
                    response.data.product;

                setProducts((current) => [
                    newProduct,
                    ...current
                ]);

                alert(
                    'Product created successfully'
                );
            }

            // =========================
            // UPDATE
            // =========================

            else {
                const response = await api.put(
                    `/products/${editingProduct.id}`,
                    data
                );

                const updatedProduct =
                    response.data.product;

                setProducts((current) =>
                    current.map((product) =>
                        product.id === updatedProduct.id
                            ? updatedProduct
                            : product
                    )
                );

                alert(
                    'Product updated successfully'
                );
            }

            closeForm();

        } catch (error) {
            console.error(
                'Save product error:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to save product.'
            );

        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE / DEACTIVATE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this product?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await api.delete(
                `/products/${id}`
            );

            const result = response.data;

            /*
                If the product has order history,
                the backend deactivates it instead
                of physically deleting it.
            */
            if (result.deactivated) {
                setProducts((current) =>
                    current.map((product) =>
                        product.id === id
                            ? {
                                  ...product,
                                  status: 'inactive'
                              }
                            : product
                    )
                );

                alert(
                    'This product has order history, so it was deactivated instead of deleted.'
                );

                return;
            }

            /*
                If there is no order history,
                the product is physically deleted.
            */
            setProducts((current) =>
                current.filter(
                    (product) => product.id !== id
                )
            );

            alert(
                'Product deleted successfully'
            );

        } catch (error) {
            console.error(
                'Delete product error:',
                error
            );

            alert(
                error.response?.data?.message ||
                'Failed to delete product.'
            );
        }
    };

    return (
        <main className="admin-page">

            <div className="admin-container">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="admin-page-header">

                    <div>

                        <span className="admin-label">
                            ADMIN PANEL
                        </span>

                        <h1>
                            Products
                        </h1>

                        <p>
                            Manage products available
                            in your store.
                        </p>

                    </div>

                    <button
                        className="admin-primary-button"
                        onClick={openAddForm}
                    >
                        <Plus size={18} />
                        Add Product
                    </button>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                {showForm && (

                    <div className="admin-form-card">

                        <div className="admin-form-header">

                            <div>

                                <h2>
                                    {editingProduct
                                        ? 'Edit Product'
                                        : 'Add Product'}
                                </h2>

                                <p>
                                    {editingProduct
                                        ? 'Update product information.'
                                        : 'Add a new product to your store.'}
                                </p>

                            </div>

                            <button
                                className="admin-close-button"
                                onClick={closeForm}
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {error && (

                            <div className="admin-error">
                                {error}
                            </div>

                        )}


                        <form
                            className="admin-product-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Category */}

                            <div className="admin-form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Name */}

                            <div className="admin-form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />

                            </div>


                            {/* Price and Stock */}

                            <div className="admin-form-row">

                                <div className="admin-form-group">

                                    <label>
                                        Price (ETB)
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        required
                                    />

                                </div>


                                <div className="admin-form-group">

                                    <label>
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="0"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Description */}

                            <div className="admin-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    rows="4"
                                />

                            </div>


                            {/* Image */}

                            <div className="admin-form-group">

                                <label>
                                    Product Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                />

                                {editingProduct &&
                                    editingProduct.image && (

                                        <small>
                                            Leave empty to keep
                                            the current image.
                                        </small>

                                    )}

                            </div>


                            {/* Buttons */}

                            <div className="admin-form-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-button"
                                    onClick={closeForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? 'Saving...'
                                        : editingProduct
                                            ? 'Update Product'
                                            : 'Create Product'}

                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="admin-loading">
                        Loading products...
                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {error &&
                    !loading &&
                    !showForm && (

                        <div className="admin-error">
                            {error}
                        </div>

                    )}


                {/* =========================
                    EMPTY
                ========================= */}

                {!loading &&
                    !error &&
                    products.length === 0 && (

                        <div className="admin-empty">

                            <Package size={48} />

                            <h2>
                                No products found
                            </h2>

                            <p>
                                Add products to your
                                store to see them here.
                            </p>

                        </div>

                    )}


                {/* =========================
                    TABLE
                ========================= */}

                {!loading &&
                    products.length > 0 && (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Product
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Price
                                        </th>

                                        <th>
                                            Stock
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {products.map(
                                        (product) => (

                                            <tr
                                                key={product.id}
                                            >

                                                {/* ID */}

                                                <td>
                                                    #{product.id}
                                                </td>


                                                {/* Product */}

                                                <td>

                                                    <div className="admin-product-cell">

                                                        {product.image ? (

                                                            <img
                                                                src={
                                                                    product.image.startsWith(
                                                                        'http'
                                                                    )
                                                                        ? product.image
                                                                        : `http://localhost:8800/uploads/products/${product.image}`
                                                                }
                                                                alt={product.name}
                                                                className="admin-product-image"
                                                            />

                                                        ) : (

                                                            <div className="admin-product-placeholder">

                                                                <Package
                                                                    size={20}
                                                                />

                                                            </div>

                                                        )}


                                                        <div>

                                                            <strong>
                                                                {product.name}
                                                            </strong>

                                                            {product.description && (

                                                                <p>

                                                                    {product.description.length > 50
                                                                        ? product.description.substring(0, 50) + '...'
                                                                        : product.description}

                                                                </p>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Category */}

                                                <td>
                                                    {product.category_name || '—'}
                                                </td>


                                                {/* Price */}

                                                <td>

                                                    {Number(
                                                        product.price || 0
                                                    ).toLocaleString()}

                                                    {' '}ETB

                                                </td>


                                                {/* Stock */}

                                                <td>

                                                    <span
                                                        className={
                                                            Number(product.stock) > 0
                                                                ? 'stock-badge stock-available'
                                                                : 'stock-badge stock-out'
                                                        }
                                                    >

                                                        {Number(product.stock) > 0
                                                            ? `${product.stock} available`
                                                            : 'Out of stock'}

                                                    </span>

                                                </td>


                                                {/* Status */}

                                                <td>

                                                    <span
                                                        className={
                                                            product.status === 'active'
                                                                ? 'status-badge status-active'
                                                                : 'status-badge status-inactive'
                                                        }
                                                    >
                                                        {product.status === 'active'
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td>

                                                    <div className="admin-actions">

                                                        {/* EDIT */}

                                                        <button
                                                            className="admin-icon-button"
                                                            title="Edit product"
                                                            onClick={() =>
                                                                openEditForm(
                                                                    product
                                                                )
                                                            }
                                                        >

                                                            <Edit
                                                                size={17}
                                                            />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            className="admin-icon-button delete-button"
                                                            title={
                                                                product.status === 'inactive'
                                                                    ? 'Product is inactive'
                                                                    : 'Delete product'
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={17}
                                                            />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </div>

        </main>
    );
}

export default Products;