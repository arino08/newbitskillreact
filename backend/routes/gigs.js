const express = require('express');
const { verifyToken } = require('./auth');
const database = require('../database/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateGig = [
    body('title').trim().isLength({ min: 5, max: 200 }),
    body('description').trim().isLength({ min: 20, max: 5000 }),
    body('categoryId').isInt({ min: 1 }),
    body('budgetMin').optional().isFloat({ min: 0 }),
    body('budgetMax').optional().isFloat({ min: 0 }),
    body('budgetType').isIn(['fixed', 'hourly']),
    body('deadline').optional().isISO8601(),
    body('difficultyLevel').isIn(['beginner', 'intermediate', 'expert']),
    body('requiredSkills').isArray(),
    body('remoteAllowed').isBoolean()
];

// Get all gigs with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const {
            category,
            minBudget,
            maxBudget,
            budgetType,
            difficultyLevel,
            remoteAllowed,
            search,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        let whereConditions = ['g.status = "open"'];
        let params = [];

        // Build dynamic WHERE clause
        if (category) {
            whereConditions.push('g.category_id = ?');
            params.push(category);
        }
        
        if (minBudget) {
            whereConditions.push('g.budget_min >= ?');
            params.push(minBudget);
        }
        
        if (maxBudget) {
            whereConditions.push('g.budget_max <= ?');
            params.push(maxBudget);
        }
        
        if (budgetType) {
            whereConditions.push('g.budget_type = ?');
            params.push(budgetType);
        }
        
        if (difficultyLevel) {
            whereConditions.push('g.difficulty_level = ?');
            params.push(difficultyLevel);
        }
        
        if (remoteAllowed !== undefined) {
            whereConditions.push('g.remote_allowed = ?');
            params.push(remoteAllowed === 'true' ? 1 : 0);
        }
        
        if (search) {
            whereConditions.push('(g.title LIKE ? OR g.description LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');
        const validSortColumns = ['created_at', 'budget_min', 'budget_max', 'deadline', 'applications_count'];
        const orderBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM gigs g 
            WHERE ${whereClause}
        `;
        const countResult = await database.get(countQuery, params);
        const total = countResult.total;

        // Get gigs with pagination
        const gigsQuery = `
            SELECT 
                g.*,
                u.full_name as posted_by_name,
                u.profile_picture as posted_by_picture,
                c.name as category_name,
                c.color as category_color
            FROM gigs g
            LEFT JOIN users u ON g.posted_by = u.id
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE ${whereClause}
            ORDER BY g.${orderBy} ${order}
            LIMIT ? OFFSET ?
        `;
        
        const gigs = await database.query(gigsQuery, [...params, limit, offset]);

        // Parse JSON fields
        const formattedGigs = gigs.map(gig => ({
            ...gig,
            requiredSkills: gig.required_skills ? JSON.parse(gig.required_skills) : [],
            tags: gig.tags ? JSON.parse(gig.tags) : [],
            attachments: gig.attachments ? JSON.parse(gig.attachments) : []
        }));

        res.json({
            gigs: formattedGigs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get gigs error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get gig by ID
router.get('/:id', async (req, res) => {
    try {
        const gig = await database.get(`
            SELECT 
                g.*,
                u.full_name as posted_by_name,
                u.profile_picture as posted_by_picture,
                u.bio as posted_by_bio,
                u.location as posted_by_location,
                c.name as category_name,
                c.color as category_color
            FROM gigs g
            LEFT JOIN users u ON g.posted_by = u.id
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.id = ?
        `, [req.params.id]);

        if (!gig) {
            return res.status(404).json({
                error: 'Gig not found'
            });
        }

        // Increment view count
        await database.run(
            'UPDATE gigs SET views_count = views_count + 1 WHERE id = ?',
            [req.params.id]
        );

        // Format the response
        const formattedGig = {
            ...gig,
            requiredSkills: gig.required_skills ? JSON.parse(gig.required_skills) : [],
            tags: gig.tags ? JSON.parse(gig.tags) : [],
            attachments: gig.attachments ? JSON.parse(gig.attachments) : [],
            viewsCount: gig.views_count + 1
        };

        res.json({
            gig: formattedGig
        });

    } catch (error) {
        console.error('Get gig error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Create new gig (requires authentication)
router.post('/', verifyToken, validateGig, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const {
            title,
            description,
            categoryId,
            budgetMin,
            budgetMax,
            budgetType,
            deadline,
            durationEstimate,
            difficultyLevel,
            requiredSkills,
            remoteAllowed,
            location,
            tags,
            isUrgent = false
        } = req.body;

        // Verify category exists
        const category = await database.get(
            'SELECT id FROM categories WHERE id = ? AND is_active = 1',
            [categoryId]
        );

        if (!category) {
            return res.status(400).json({
                error: 'Invalid category'
            });
        }

        const result = await database.insert(`
            INSERT INTO gigs (
                title, description, category_id, posted_by, budget_min, budget_max,
                budget_type, deadline, duration_estimate, difficulty_level,
                required_skills, remote_allowed, location, tags, is_urgent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title, description, categoryId, req.user.id, budgetMin, budgetMax,
            budgetType, deadline, durationEstimate, difficultyLevel,
            JSON.stringify(requiredSkills), remoteAllowed ? 1 : 0,
            location, JSON.stringify(tags || []), isUrgent ? 1 : 0
        ]);

        res.status(201).json({
            message: 'Gig created successfully',
            gigId: result.id
        });

    } catch (error) {
        console.error('Create gig error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update gig (requires authentication and ownership)
router.put('/:id', verifyToken, validateGig, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        // Check if user owns the gig
        const gig = await database.get(
            'SELECT posted_by FROM gigs WHERE id = ?',
            [req.params.id]
        );

        if (!gig) {
            return res.status(404).json({
                error: 'Gig not found'
            });
        }

        if (gig.posted_by !== req.user.id) {
            return res.status(403).json({
                error: 'Unauthorized: You can only edit your own gigs'
            });
        }

        const {
            title,
            description,
            categoryId,
            budgetMin,
            budgetMax,
            budgetType,
            deadline,
            durationEstimate,
            difficultyLevel,
            requiredSkills,
            remoteAllowed,
            location,
            tags,
            isUrgent
        } = req.body;

        await database.run(`
            UPDATE gigs SET
                title = ?, description = ?, category_id = ?, budget_min = ?, budget_max = ?,
                budget_type = ?, deadline = ?, duration_estimate = ?, difficulty_level = ?,
                required_skills = ?, remote_allowed = ?, location = ?, tags = ?, is_urgent = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            title, description, categoryId, budgetMin, budgetMax,
            budgetType, deadline, durationEstimate, difficultyLevel,
            JSON.stringify(requiredSkills), remoteAllowed ? 1 : 0,
            location, JSON.stringify(tags || []), isUrgent ? 1 : 0,
            req.params.id
        ]);

        res.json({
            message: 'Gig updated successfully'
        });

    } catch (error) {
        console.error('Update gig error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Delete gig (requires authentication and ownership)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Check if user owns the gig
        const gig = await database.get(
            'SELECT posted_by FROM gigs WHERE id = ?',
            [req.params.id]
        );

        if (!gig) {
            return res.status(404).json({
                error: 'Gig not found'
            });
        }

        if (gig.posted_by !== req.user.id) {
            return res.status(403).json({
                error: 'Unauthorized: You can only delete your own gigs'
            });
        }

        await database.run(
            'DELETE FROM gigs WHERE id = ?',
            [req.params.id]
        );

        res.json({
            message: 'Gig deleted successfully'
        });

    } catch (error) {
        console.error('Delete gig error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;