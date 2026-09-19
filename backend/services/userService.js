const db = require('../config/db');

const getAllCustomers = async () => {
    const [customers] = await db.query(`
        SELECT
            id,
            name,
            email,
            phone,
            address,
            created_at
        FROM users
        WHERE role = 'customer'
        ORDER BY id DESC
    `);

    return customers;
};

const getCustomerById = async (customerId) => {
    const [customers] = await db.query(`
        SELECT
            id,
            name,
            email,
            phone,
            address,
            created_at
        FROM users
        WHERE id = ?
        AND role = 'customer'
    `, [customerId]);

    if (customers.length === 0) {
        throw new Error('Customer not found');
    }

    return customers[0];
};

module.exports = {
    getAllCustomers,
    getCustomerById
};