const db = require('../config/db');

// Get user's cart
const getCart = async (userId) => {
    const [rows] = await db.query(`
        SELECT
            ci.id,
            ci.product_id,
            p.name,
            p.description,
            p.price,
            p.image,
            p.stock,
            ci.quantity,
            (p.price * ci.quantity) AS subtotal
        FROM cart c
        JOIN cart_items ci ON c.id = ci.cart_id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = ?
    `, [userId]);

    let subtotal = 0;

    rows.forEach(item => {
        subtotal += Number(item.subtotal);
    });

    const deliveryFee = rows.length > 0 ? 150 : 0;
    const total = subtotal + deliveryFee;

    return {
        items: rows,
        subtotal,
        deliveryFee,
        total
    };
};


// Add product to cart
const addToCart = async (userId, productId, quantity = 1) => {

    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    // Check product
    const [products] = await db.query(
        'SELECT id, stock, status FROM products WHERE id = ?',
        [productId]
    );

    if (products.length === 0) {
        throw new Error('Product not found');
    }

    if (products[0].status !== 'active') {
        throw new Error('Product is not available');
    }

    if (products[0].stock < quantity) {
        throw new Error('Not enough stock');
    }

    // Find cart
    const [carts] = await db.query(
        'SELECT id FROM cart WHERE user_id = ?',
        [userId]
    );

    let cartId;

    if (carts.length === 0) {
        const [result] = await db.query(
            'INSERT INTO cart (user_id) VALUES (?)',
            [userId]
        );

        cartId = result.insertId;
    } else {
        cartId = carts[0].id;
    }

    // Check existing item
    const [items] = await db.query(
        `SELECT quantity
         FROM cart_items
         WHERE cart_id = ? AND product_id = ?`,
        [cartId, productId]
    );

    if (items.length > 0) {

        const newQuantity = items[0].quantity + quantity;

        if (newQuantity > products[0].stock) {
            throw new Error('Not enough stock');
        }

        await db.query(
            `UPDATE cart_items
             SET quantity = ?
             WHERE cart_id = ? AND product_id = ?`,
            [newQuantity, cartId, productId]
        );

    } else {

        await db.query(
            `INSERT INTO cart_items
             (cart_id, product_id, quantity)
             VALUES (?, ?, ?)`,
            [cartId, productId, quantity]
        );
    }

    return { message: 'Product added to cart' };
};


// Update quantity
const updateCart = async (userId, productId, quantity) => {

    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    const [products] = await db.query(
        'SELECT stock FROM products WHERE id = ?',
        [productId]
    );

    if (products.length === 0) {
        throw new Error('Product not found');
    }

    if (quantity > products[0].stock) {
        throw new Error('Not enough stock');
    }

    const [result] = await db.query(`
        UPDATE cart_items ci
        JOIN cart c ON ci.cart_id = c.id
        SET ci.quantity = ?
        WHERE c.user_id = ?
        AND ci.product_id = ?
    `, [quantity, userId, productId]);

    if (result.affectedRows === 0) {
        throw new Error('Cart item not found');
    }

    return { message: 'Cart updated' };
};


// Remove product
const removeFromCart = async (userId, productId) => {

    const [result] = await db.query(`
        DELETE ci
        FROM cart_items ci
        JOIN cart c ON ci.cart_id = c.id
        WHERE c.user_id = ?
        AND ci.product_id = ?
    `, [userId, productId]);

    if (result.affectedRows === 0) {
        throw new Error('Cart item not found');
    }

    return { message: 'Product removed from cart' };
};


// Clear cart
const clearCart = async (userId) => {

    await db.query(`
        DELETE ci
        FROM cart_items ci
        JOIN cart c ON ci.cart_id = c.id
        WHERE c.user_id = ?
    `, [userId]);

    return { message: 'Cart cleared' };
};


module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
};