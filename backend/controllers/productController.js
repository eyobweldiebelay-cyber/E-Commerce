const productService = require('../services/productServce');

const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let products;

        if (search) {
            products = await productService.searchProducts(search);
        } else if (category) {
            products = await productService.getProductsByCategory(category);
        } else {
            products = await productService.getAllProducts();
        }

        res.status(200).json({
            products
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to get products'
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);

        res.status(200).json({
            product
        });

    } catch (error) {
        console.error(error);

        res.status(404).json({
            message: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {category_id,name,price,stock,description} = req.body;

        if (!category_id ||!name ||price === undefined ||stock === undefined
        ) {
            return res.status(400).json({
                message: 'Category, name, price and stock are required'
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                message: 'Price cannot be negative'
            });
        }

        if (Number(stock) < 0) {
            return res.status(400).json({
                message: 'Stock cannot be negative'
            });
        }

        const product = await productService.createProduct({
            category_id,
            name,
            description,
            price,
            stock,
            image: req.file ? req.file.filename : null
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            price,
            stock
        } = req.body;

        if (
            !category_id ||
            !name ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: 'Category, name, price and stock are required'
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                message: 'Price cannot be negative'
            });
        }

        if (Number(stock) < 0) {
            return res.status(400).json({
                message: 'Stock cannot be negative'
            });
        }

        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);

        res.status(200).json({
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};