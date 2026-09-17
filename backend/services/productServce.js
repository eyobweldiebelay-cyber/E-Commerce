const db = require('../config/db');

const getAllProducts = async () => {
    const [products] = await db.query(`
        SELECT
            p.id,
            p.category_id,
            c.name AS category_name,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            p.status
        FROM products p
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.id DESC
    `);

    return products;
};

const getProductById = async (id) => {
    const [products] = await db.query(`
        SELECT
            p.id,
            p.category_id,
            c.name AS category_name,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            p.status
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `, [id]);

    if (products.length === 0) {
        throw new Error('Product not found');
    }

    return products[0];
};

const createProduct = async (productData) => {
    const {
        category_id,
        name,
        description,
        price,
        stock,
        image
    } = productData;

    const [category] = await db.query(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
    );

    if (category.length === 0) {
        throw new Error('Category not found');
    }

    const [result] = await db.query(
        `INSERT INTO products
        (category_id, name, description, price, stock, image)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            category_id,
            name,
            description || null,
            price,
            stock,
            image || null
        ]
    );

    return {
        id: result.insertId,
        category_id,
        name,
        description: description || null,
        price,
        stock,
        image: image || null,
        status: 'active'
    };
};

const updateProduct = async (id, productData) => {
    const {
        category_id,
        name,
        description,
        price,
        stock,
        image,
        status
    } = productData;

    const [existing] = await db.query(
        'SELECT id FROM products WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        throw new Error('Product not found');
    }

    const [category] = await db.query(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
    );

    if (category.length === 0) {
        throw new Error('Category not found');
    }

    await db.query(
        `UPDATE products
         SET category_id = ?,
             name = ?,
             description = ?,
             price = ?,
             stock = ?,
             image = ?,
             status = ?
         WHERE id = ?`,
        [
            category_id,
            name,
            description || null,
            price,
            stock,
            image || null,
            status || 'active',
            id
        ]
    );

    return getProductById(id);
};

const deleteProduct = async (id) => {
    const [existing] = await db.query(
        'SELECT id FROM products WHERE id = ?',
        [id]
    );

    if (existing.length === 0) {
        throw new Error('Product not found');
    }

    await db.query(
        'DELETE FROM products WHERE id = ?',
        [id]
    );

    return true;
};

const searchProducts = async (search) => {
    const [products] = await db.query(`
        SELECT
            p.id,
            p.category_id,
            c.name AS category_name,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            p.status
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ?
           OR p.description LIKE ?
        ORDER BY p.id DESC
    `, [
        `%${search}%`,
        `%${search}%`
    ]);

    return products;
};

const getProductsByCategory = async (categoryId) => {
    const [products] = await db.query(`
        SELECT
            p.id,
            p.category_id,
            c.name AS category_name,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.image,
            p.status
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ?
        ORDER BY p.id DESC
    `, [categoryId]);

    return products;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory
};