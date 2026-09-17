const db = require('../config/db');

const getAllCategories = async () => {
    const [categories] = await db.query(
        `SELECT id, name, image
         FROM categories
         ORDER BY id DESC`
    );

    return categories;
};

const getCategoryById = async (id) => {
    const [categories] = await db.query(
        `SELECT id, name, image
         FROM categories
         WHERE id = ?`,
        [id]
    );

    if (categories.length === 0) {
        throw new Error('Category not found');
    }

    return categories[0];
};

const createCategory = async (name, image = null) => {
    const [existing] = await db.query(
        `SELECT id
         FROM categories
         WHERE name = ?`,
        [name]
    );

    if (existing.length > 0) {
        throw new Error('Category already exists');
    }

    const [result] = await db.query(
        `INSERT INTO categories (name, image)
         VALUES (?, ?)`,
        [name, image]
    );

    return {
        id: result.insertId,
        name,
        image
    };
};

const updateCategory = async (id, name, image = null) => {
    const [existing] = await db.query(
        `SELECT id
         FROM categories
         WHERE id = ?`,
        [id]
    );

    if (existing.length === 0) {
        throw new Error('Category not found');
    }

    await db.query(
        `UPDATE categories
         SET name = ?, image = ?
         WHERE id = ?`,
        [name, image, id]
    );

    return {
        id,
        name,
        image
    };
};

const deleteCategory = async (id) => {
    const [existing] = await db.query(
        `SELECT id
         FROM categories
         WHERE id = ?`,
        [id]
    );

    if (existing.length === 0) {
        throw new Error('Category not found');
    }

    await db.query(
        `DELETE FROM categories
         WHERE id = ?`,
        [id]
    );

    return true;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};