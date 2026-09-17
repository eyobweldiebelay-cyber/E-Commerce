const db = require('../config/db');


// Get favorites
const getFavorites = async (userId) => {

    const [rows] = await db.query(`
        SELECT
            f.id,
            p.id AS product_id,
            p.name,
            p.description,
            p.price,
            p.image,
            p.stock,
            p.status
        FROM favorites f
        JOIN products p ON f.product_id = p.id
        WHERE f.user_id = ?
        ORDER BY f.id DESC
    `, [userId]);

    return rows;
};


// Add favorite
const addFavorite = async (userId, productId) => {

    const [products] = await db.query(
        'SELECT id FROM products WHERE id = ?',
        [productId]
    );

    if (products.length === 0) {
        throw new Error('Product not found');
    }

    const [existing] = await db.query(
        `SELECT id
         FROM favorites
         WHERE user_id = ? AND product_id = ?`,
        [userId, productId]
    );

    if (existing.length > 0) {
        throw new Error('Product already in favorites');
    }

    await db.query(
        `INSERT INTO favorites
         (user_id, product_id)
         VALUES (?, ?)`,
        [userId, productId]
    );

    return {
        message: 'Product added to favorites'
    };
};


// Remove favorite
const removeFavorite = async (userId, productId) => {

    const [result] = await db.query(
        `DELETE FROM favorites
         WHERE user_id = ?
         AND product_id = ?`,
        [userId, productId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Favorite not found');
    }

    return {
        message: 'Product removed from favorites'
    };
};


// Check favorite
const checkFavorite = async (userId, productId) => {

    const [rows] = await db.query(
        `SELECT id
         FROM favorites
         WHERE user_id = ?
         AND product_id = ?`,
        [userId, productId]
    );

    return {
        isFavorite: rows.length > 0
    };
};


module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
};