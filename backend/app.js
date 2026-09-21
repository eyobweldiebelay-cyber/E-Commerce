const authMiddleware = require('./middleware/authMiddleware');
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoute = require('./routes/authRoute');

const app = express();

app.use(cors());
app.use(express.json());
//upload document
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

app.get('/', (req, res) => {
    res.json({
        message: 'E-Commerce API is running'
    });
});

app.use('/api/auth', authRoute);
app.get('/api/auth/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'You are authenticated',
        user: req.user
    });
});
//category route
const categoryRoute = require('./routes/categoryRoute');
app.use('/api/categories', categoryRoute);
//product route
const productRoute = require('./routes/productRoute');
app.use('/api/products', productRoute);
//more in once
const cartRoute = require('./routes/cartRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const orderRoute = require('./routes/orderRoute');
const paymentRoute = require('./routes/paymentRoute');

app.use('/api/cart', cartRoute);
app.use('/api/favorites', favoriteRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payments', paymentRoute);
//getAll coustmer or once
const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute);


module.exports = app;