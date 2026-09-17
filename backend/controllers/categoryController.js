const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();

        res.status(200).json({
            categories
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to get categories'
        });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(
            req.params.id
        );

        res.status(200).json({
            category
        });

    } catch (error) {
        console.error(error);

        res.status(404).json({
            message: error.message
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Category name is required'
            });
        }

        const category = await categoryService.createCategory(
            name,
            image || null
        );

        res.status(201).json({
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Category name is required'
            });
        }

        const category = await categoryService.updateCategory(
            req.params.id,
            name,
            image || null
        );

        res.status(200).json({
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);

        res.status(200).json({
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};