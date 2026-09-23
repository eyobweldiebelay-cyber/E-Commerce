const multer = require('multer');
const path = require('path');
const fs = require('fs');


// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let uploadPath;


        // ========================================
        // CATEGORY IMAGES
        // ========================================

        if (req.baseUrl === '/api/categories') {

            uploadPath = path.join(
                __dirname,
                '../uploads/categories'
            );

        }


        // ========================================
        // PRODUCT IMAGES
        // ========================================

        else if (req.baseUrl === '/api/products') {

            uploadPath = path.join(
                __dirname,
                '../uploads/products'
            );

        }


        // ========================================
        // INVALID UPLOAD ROUTE
        // ========================================

        else {

            return cb(
                new Error('Invalid upload route')
            );

        }


        // Create folder if it does not exist

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(uploadPath, {
                recursive: true
            });

        }


        cb(null, uploadPath);
    },


    // ========================================
    // FILE NAME
    // ========================================

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1E9);


        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }

});


// ========================================
// FILE TYPE FILTER
// ========================================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                'Only JPG, JPEG, PNG and WEBP images are allowed'
            )
        );

    }

};


// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


module.exports = upload;