const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        const user = await authService.registerUser(req.body);

        res.status(201).json({
            message: 'Registration successful',
            user
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await authService.loginUser(email, password);

        const token = jwt.sign({
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        console.error(error);

        res.status(401).json({
            message: error.message
        });
    }
};
const getProfile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.user_id);

        res.json({
            user
        });

    } catch (error) {
        console.error(error);

        res.status(404).json({
            message: error.message
        });
    }
};
module.exports = {
    register,
    login,
    getProfile
};

/*
sudo apt autoremove -y && rm -rf ~/.config/google-chrome ~/.config/chromium
sudo apt purge chromium-browser -y
*/