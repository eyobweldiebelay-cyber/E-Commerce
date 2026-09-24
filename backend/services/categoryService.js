const db = require('../config/db');


// ========================================
// GET ALL CATEGORIES
// ========================================

const getAllCategories = async () => {

    const [categories] = await db.query(`
        SELECT
            id,
            name,
            image
        FROM categories
        ORDER BY id DESC
    `);

    return categories;
};


// ========================================
// GET CATEGORY BY ID
// ========================================

const getCategoryById = async (id) => {

    const [categories] = await db.query(
        `
        SELECT
            id,
            name,
            image
        FROM categories
        WHERE id = ?
        `,
        [id]
    );


    if (categories.length === 0) {

        throw new Error(
            'Category not found'
        );

    }


    return categories[0];
};


// ========================================
// CREATE CATEGORY
// ========================================

const createCategory = async (
    name,
    image = null
) => {

    // Check duplicate category

    const [existing] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE name = ?
        `,
        [name]
    );


    if (existing.length > 0) {

        throw new Error(
            'Category already exists'
        );

    }


    // Insert category

    const [result] = await db.query(
        `
        INSERT INTO categories
        (
            name,
            image
        )
        VALUES (?, ?)
        `,
        [
            name,
            image
        ]
    );


    return {

        id: result.insertId,

        name: name,

        image: image

    };
};


// ========================================
// UPDATE CATEGORY
// ========================================

const updateCategory = async (
    id,
    name,
    image = null
) => {

    // Find existing category

    const [existing] = await db.query(
        `
        SELECT
            id,
            name,
            image
        FROM categories
        WHERE id = ?
        `,
        [id]
    );


    if (existing.length === 0) {

        throw new Error(
            'Category not found'
        );

    }


    // Check duplicate name

    const [duplicate] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE name = ?
        AND id != ?
        `,
        [
            name,
            id
        ]
    );


    if (duplicate.length > 0) {

        throw new Error(
            'Category already exists'
        );

    }


    // ========================================
    // KEEP OLD IMAGE IF NO NEW IMAGE
    // ========================================

    const finalImage =
        image ||
        existing[0].image ||
        null;


    // Update category

    await db.query(` UPDATE categories SET
            name = ?,
            image = ?
        WHERE id = ?
        `,
        [
            name,
            finalImage,
            id
        ]
    );


    return await getCategoryById(id);
};


// ========================================
// DELETE CATEGORY
// ========================================

const deleteCategory = async (id) => {

    // ========================================
    // CHECK CATEGORY
    // ========================================

    const [category] = await db.query(
        `
        SELECT
            id,
            name
        FROM categories
        WHERE id = ?
        `,
        [id]
    );


    if (category.length === 0) {

        throw new Error(
            'Category not found'
        );

    }


    // ========================================
    // FIND PRODUCTS IN CATEGORY
    // ========================================

    const [products] = await db.query(
        `
        SELECT id
        FROM products
        WHERE category_id = ?
        `,
        [id]
    );


    // ========================================
    // DELETE PRODUCTS AND RELATED DATA
    // ========================================

    for (const product of products) {

        // Delete cart items

        await db.query(
            `
            DELETE FROM cart_items
            WHERE product_id = ?
            `,
            [product.id]
        );


        // Delete favorites

        await db.query(
            `
            DELETE FROM favorites
            WHERE product_id = ?
            `,
            [product.id]
        );


        // Delete order items

        await db.query(
            `
            DELETE FROM order_items
            WHERE product_id = ?
            `,
            [product.id]
        );


        // Delete product

        await db.query(
            `
            DELETE FROM products
            WHERE id = ?
            `,
            [product.id]
        );

    }


    // ========================================
    // DELETE CATEGORY
    // ========================================

    await db.query(
        `
        DELETE FROM categories
        WHERE id = ?
        `,
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