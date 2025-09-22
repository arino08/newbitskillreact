const express = require('express');
const { verifyToken } = require('./auth');
const database = require('../database/database');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await database.get(`
            SELECT 
                id, email, full_name, role, profile_picture, bio, skills,
                location, website, phone, is_verified, created_at
            FROM users 
            WHERE id = ? AND is_active = 1
        `, [req.params.id]);

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
        console.error('Get user profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update user profile (requires authentication)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const {
            fullName,
            bio,
            skills,
            location,
            website,
            phone
        } = req.body;

        await database.run(`
            UPDATE users SET
                full_name = ?, bio = ?, skills = ?, location = ?, 
                website = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            fullName,
            bio,
            JSON.stringify(skills || []),
            location,
            website,
            phone,
            req.user.id
        ]);

        res.json({
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;