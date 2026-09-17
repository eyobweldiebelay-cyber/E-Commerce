const db = require('../config/db');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    const { name, email, password, phone, address } = userData;

    // Check if email already exists
    const [existingUser] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existingUser.length > 0) {
        throw new Error('Email already exists');
    }

    // Check if phone already exists
    if (phone) {
        const [existingPhone] = await db.query(
            'SELECT id FROM users WHERE phone = ?',
            [phone]
        );

        if (existingPhone.length > 0) {
            throw new Error('Phone number already exists');
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
        `INSERT INTO users
        (name, email, password, phone, address)
        VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            email,
            hashedPassword,
            phone || null,
            address || null
        ]
    );

    return {
        id: result.insertId,
        name,
        email,
        phone: phone || null,
        address: address || null,
        role: 'customer'
    };
};

//loginUser function can be implemented here in the future
const loginUser = async (email, password) => {
    const [users] = await db.query(
        `SELECT id, name, email, password, phone, address, role
         FROM users
         WHERE email = ?`,
        [email]
    );

    if (users.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
    };
};
module.exports = {
    registerUser,
    loginUser
};
