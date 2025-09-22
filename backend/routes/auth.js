const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const database = require('../database/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('email').isEmail().normalizeEmail(),
    body('fullName').trim().isLength({ min: 2, max: 100 }),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('role').isIn(['student', 'freelancer', 'employer'])
];

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
];

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRY || '24h' }
    );
};

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, fullName, password, role = 'student' } = req.body;

        // Check if user already exists
        const existingUser = await database.get(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser) {
            return res.status(409).json({
                error: 'User already exists with this email'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

        // Create user
        const result = await database.insert(
            `INSERT INTO users (email, full_name, password_hash, role) 
             VALUES (?, ?, ?, ?)`,
            [email, fullName, passwordHash, role]
        );

        // Generate token
        const user = {
            id: result.id,
            email,
            full_name: fullName,
            role
        };

        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // Get user with password
        const user = await database.get(
            'SELECT * FROM users WHERE email = ? AND is_active = 1',
            [email]
        );

        if (!user || !user.password_hash) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Update last login
        await database.run(
            'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                profilePicture: user.profile_picture,
                isVerified: user.is_verified
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // Generate JWT token
        const token = generateToken(req.user);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// LinkedIn OAuth routes
router.get('/linkedin',
    passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })
);

router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false }),
    (req, res) => {
        // Generate JWT token
        const token = generateToken(req.user);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// Verify token middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await database.get(
            `SELECT id, email, full_name, role, profile_picture, bio, skills, 
                    location, website, phone, is_verified, created_at 
             FROM users WHERE id = ?`,
            [req.user.id]
        );

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            user: {
                ...user,
                fullName: user.full_name,
                profilePicture: user.profile_picture,
                isVerified: user.is_verified,
                createdAt: user.created_at,
                skills: user.skills ? JSON.parse(user.skills) : []
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Logout (invalidate token)
router.post('/logout', verifyToken, async (req, res) => {
    try {
        // In a more robust implementation, you'd maintain a blacklist of tokens
        // For now, we'll just send a success response
        res.json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = { router, verifyToken };