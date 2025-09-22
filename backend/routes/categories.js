const express = require('express');
const { verifyToken } = require('./auth');
const database = require('../database/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await database.query(
            'SELECT * FROM categories WHERE is_active = 1 ORDER BY name'
        );

        res.json({
            categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await database.get(
            'SELECT * FROM categories WHERE id = ? AND is_active = 1',
            [req.params.id]
        );

        if (!category) {
            return res.status(404).json({
                error: 'Category not found'
            });
        }

        res.json({
            category
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;