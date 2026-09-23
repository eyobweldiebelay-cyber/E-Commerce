const categoryService = require('../services/categoryService');


// ========================================
// GET ALL CATEGORIES
// ========================================

const getCategories = async (req, res) => {

    try {

        const categories =
            await categoryService.getAllCategories();

        res.status(200).json({
            categories
        });

    } catch (error) {

        console.error(
            'Get categories error:',
            error
        );

        res.status(500).json({
            message: 'Failed to get categories'
        });
    }
};


// ========================================
// GET ONE CATEGORY
// ========================================

const getCategory = async (req, res) => {

    try {

        const category =
            await categoryService.getCategoryById(
                req.params.id
            );

        res.status(200).json({
            category
        });

    } catch (error) {

        console.error(
            'Get category error:',
            error
        );

        res.status(404).json({
            message: error.message
        });
    }
};


// ========================================
// CREATE CATEGORY
// ========================================

const createCategory = async (req, res) => {

    try {

        const { name } = req.body;


        // Check category name

        if (!name || !name.trim()) {

            return res.status(400).json({
                message: 'Category name is required'
            });

        }


        // ========================================
        // GET IMAGE FROM MULTER
        // ========================================

        const image = req.file
            ? req.file.filename
            : null;


        console.log('Category name:', name);
        console.log('Category image:', image);


        // ========================================
        // CREATE CATEGORY
        // ========================================

        const category =
            await categoryService.createCategory(
                name.trim(),
                image
            );


        res.status(201).json({

            message: 'Category created successfully',

            category

        });

    } catch (error) {

        console.error(
            'Create category error:',
            error
        );

        res.status(400).json({
            message: error.message
        });
    }
};


// ========================================
// UPDATE CATEGORY
// ========================================

const updateCategory = async (req, res) => {

    try {

        const { name } = req.body;


        // Check category name

        if (!name || !name.trim()) {

            return res.status(400).json({
                message: 'Category name is required'
            });

        }


        // ========================================
        // GET NEW IMAGE
        // ========================================

        const image = req.file
            ? req.file.filename
            : null;


        console.log('Updated category name:', name);
        console.log('Updated category image:', image);


        // ========================================
        // UPDATE CATEGORY
        // ========================================

        const category =
            await categoryService.updateCategory(
                req.params.id,
                name.trim(),
                image
            );


        res.status(200).json({

            message: 'Category updated successfully',

            category

        });

    } catch (error) {

        console.error(
            'Update category error:',
            error
        );

        res.status(400).json({
            message: error.message
        });
    }
};


// ========================================
// DELETE CATEGORY
// ========================================

const deleteCategory = async (req, res) => {

    try {

        await categoryService.deleteCategory(
            req.params.id
        );


        res.status(200).json({

            message: 'Category deleted successfully'

        });

    } catch (error) {

        console.error(
            'Delete category error:',
            error
        );

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