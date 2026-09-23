import { useEffect, useState } from 'react';
import {
    Folder,
    Plus,
    Edit,
    Trash2,
    X
} from 'lucide-react';

import api from '../../api/api';

function Categories() {

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        image: null
    });


    // =========================
    // LOAD CATEGORIES
    // =========================

    useEffect(() => {
        loadCategories();
    }, []);


    const loadCategories = async () => {

        try {

            setLoading(true);
            setError('');

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

            setError(
                error.response?.data?.message ||
                'Failed to load categories.'
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };


    // =========================
    // IMAGE
    // =========================

    const handleImageChange = (event) => {

        setFormData((current) => ({
            ...current,
            image: event.target.files[0]
        }));
    };


    // =========================
    // ADD FORM
    // =========================

    const openAddForm = () => {

        setEditingCategory(null);

        setFormData({
            name: '',
            image: null
        });

        setError('');

        setShowForm(true);
    };


    // =========================
    // EDIT FORM
    // =========================

    const openEditForm = (category) => {

        setEditingCategory(category);

        setFormData({
            name: category.name || '',
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
        setEditingCategory(null);
        setError('');
    };


    // =========================
    // SAVE CATEGORY
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError('');

            const data = new FormData();

            data.append(
                'name',
                formData.name.trim()
            );

            if (formData.image) {

                data.append(
                    'image',
                    formData.image
                );

            }


            // CREATE

            if (!editingCategory) {

                const response = await api.post('/categories',
                    data
                );

                const newCategory = response.data.category;

                setCategories((current) => [
                    newCategory,
                    ...current
                ]);

                alert(
                    'Category created successfully'
                );

            }


            // UPDATE

            else {

                const response = await api.put(
                    `/categories/${editingCategory.id}`,
                    data
                );

                const updatedCategory = response.data.category;

                setCategories((current) =>
                    current.map((category) =>
                        category.id === updatedCategory.id
                            ? updatedCategory
                            : category
                    )
                );

                alert(
                    'Category updated successfully'
                );
            }


            closeForm();

        } catch (error) {

            console.error(
                'Save category error:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to save category.'
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this category?'
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/categories/${id}`);

            setCategories((current) =>
                current.filter(
                    (category) =>
                        category.id !== id
                )
            );

            alert(
                'Category deleted successfully'
            );

        } catch (error) {

            console.error(
                'Delete category error:',
                error
            );

            alert(
                error.response?.data?.message ||
                'Failed to delete category.'
            );
        }
    };


    return (
        <main className="admin-page">

            <div className="admin-container">


                {/* HEADER */}

                <div className="admin-page-header">

                    <div>

                        <span className="admin-label">
                            ADMIN PANEL
                        </span>

                        <h1>
                            Categories
                        </h1>

                        <p>
                            Manage product categories
                            in your store.
                        </p>

                    </div>


                    <button
                        className="admin-primary-button"
                        onClick={openAddForm}
                    >
                        <Plus size={18} />
                        Add Category
                    </button>

                </div>


                {/* FORM */}

                {showForm && (

                    <div className="admin-form-card">

                        <div className="admin-form-header">

                            <div>

                                <h2>
                                    {editingCategory
                                        ? 'Edit Category'
                                        : 'Add Category'}
                                </h2>

                                <p>
                                    {editingCategory
                                        ? 'Update category information.'
                                        : 'Create a new product category.'}
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

                            <div className="admin-form-group">

                                <label>
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Example: Electronics"
                                    required
                                />

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Category Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                />

                                {editingCategory &&
                                    editingCategory.image && (

                                        <small>
                                            Leave empty to keep
                                            the current image.
                                        </small>

                                    )}

                            </div>


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
                                        : editingCategory
                                            ? 'Update Category'
                                            : 'Create Category'}

                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* LOADING */}

                {loading && (
                    <div className="admin-loading">
                        Loading categories...
                    </div>
                )}


                {/* ERROR */}

                {error &&
                    !loading &&
                    !showForm && (

                        <div className="admin-error">
                            {error}
                        </div>

                    )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    categories.length === 0 && (

                        <div className="admin-empty">

                            <Folder size={48} />

                            <h2>
                                No categories found
                            </h2>

                            <p>
                                Add a category to your store.
                            </p>

                        </div>

                    )}


                {/* TABLE */}

                {!loading &&
                    categories.length > 0 && (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Image
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {categories.map(
                                        (category) => (

                                            <tr
                                                key={category.id}
                                            >

                                                <td>
                                                    #{category.id}
                                                </td>


                                                <td>

                                                    <div className="customer-name">

                                                        <div className="customer-avatar">
                                                            <Folder size={18} />
                                                        </div>

                                                        <strong>
                                                            {category.name}
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    {category.image ? (

                                                        <img
                                                            src={`http://localhost:8800/uploads/categories/${category.image}`}
                                                            alt={category.name}
                                                            className="admin-category-image"
                                                        />

                                                    ) : (

                                                        <span>
                                                            No image
                                                        </span>

                                                    )}

                                                </td>


                                                <td>

                                                    <div className="admin-actions">


                                                        {/* EDIT */}

                                                        <button
                                                            className="admin-icon-button"
                                                            title="Edit category"
                                                            onClick={() =>
                                                                openEditForm(
                                                                    category
                                                                )
                                                            }
                                                        >

                                                            <Edit size={17} />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            className="admin-icon-button delete-button"
                                                            title="Delete category"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category.id
                                                                )
                                                            }
                                                        >

                                                            <Trash2 size={17} />

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

export default Categories;