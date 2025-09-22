const express = require('express');
const { verifyToken } = require('./auth');
const database = require('../database/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateApplication = [
    body('coverLetter').trim().isLength({ min: 50, max: 2000 }),
    body('proposedRate').optional().isFloat({ min: 0 }),
    body('proposedTimeline').trim().isLength({ min: 5, max: 500 }),
    body('portfolioLinks').optional().isArray()
];

// Get applications for a gig (gig owner only)
router.get('/gig/:gigId', verifyToken, async (req, res) => {
    try {
        // Verify user owns the gig
        const gig = await database.get(
            'SELECT posted_by FROM gigs WHERE id = ?',
            [req.params.gigId]
        );

        if (!gig) {
            return res.status(404).json({
                error: 'Gig not found'
            });
        }

        if (gig.posted_by !== req.user.id) {
            return res.status(403).json({
                error: 'Unauthorized: You can only view applications for your own gigs'
            });
        }

        const applications = await database.query(`
            SELECT 
                a.*,
                u.full_name as applicant_name,
                u.profile_picture as applicant_picture,
                u.bio as applicant_bio,
                u.skills as applicant_skills,
                u.location as applicant_location
            FROM applications a
            LEFT JOIN users u ON a.applicant_id = u.id
            WHERE a.gig_id = ?
            ORDER BY a.applied_at DESC
        `, [req.params.gigId]);

        const formattedApplications = applications.map(app => ({
            ...app,
            applicantName: app.applicant_name,
            applicantPicture: app.applicant_picture,
            applicantBio: app.applicant_bio,
            applicantSkills: app.applicant_skills ? JSON.parse(app.applicant_skills) : [],
            applicantLocation: app.applicant_location,
            portfolioLinks: app.portfolio_links ? JSON.parse(app.portfolio_links) : [],
            appliedAt: app.applied_at,
            updatedAt: app.updated_at
        }));

        res.json({
            applications: formattedApplications
        });

    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get user's applications
router.get('/my-applications', verifyToken, async (req, res) => {
    try {
        const applications = await database.query(`
            SELECT 
                a.*,
                g.title as gig_title,
                g.budget_min,
                g.budget_max,
                g.budget_type,
                g.status as gig_status,
                u.full_name as gig_owner_name
            FROM applications a
            LEFT JOIN gigs g ON a.gig_id = g.id
            LEFT JOIN users u ON g.posted_by = u.id
            WHERE a.applicant_id = ?
            ORDER BY a.applied_at DESC
        `, [req.user.id]);

        const formattedApplications = applications.map(app => ({
            ...app,
            gigTitle: app.gig_title,
            budgetMin: app.budget_min,
            budgetMax: app.budget_max,
            budgetType: app.budget_type,
            gigStatus: app.gig_status,
            gigOwnerName: app.gig_owner_name,
            portfolioLinks: app.portfolio_links ? JSON.parse(app.portfolio_links) : [],
            appliedAt: app.applied_at,
            updatedAt: app.updated_at
        }));

        res.json({
            applications: formattedApplications
        });

    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Apply to a gig
router.post('/', verifyToken, validateApplication, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const {
            gigId,
            coverLetter,
            proposedRate,
            proposedTimeline,
            portfolioLinks = []
        } = req.body;

        // Check if gig exists and is open
        const gig = await database.get(
            'SELECT id, posted_by, status FROM gigs WHERE id = ?',
            [gigId]
        );

        if (!gig) {
            return res.status(404).json({
                error: 'Gig not found'
            });
        }

        if (gig.status !== 'open') {
            return res.status(400).json({
                error: 'This gig is no longer accepting applications'
            });
        }

        if (gig.posted_by === req.user.id) {
            return res.status(400).json({
                error: 'You cannot apply to your own gig'
            });
        }

        // Check if user has already applied
        const existingApplication = await database.get(
            'SELECT id FROM applications WHERE gig_id = ? AND applicant_id = ?',
            [gigId, req.user.id]
        );

        if (existingApplication) {
            return res.status(409).json({
                error: 'You have already applied to this gig'
            });
        }

        // Create application
        await database.transaction(async (db) => {
            // Insert application
            await db.insert(`
                INSERT INTO applications (
                    gig_id, applicant_id, cover_letter, proposed_rate,
                    proposed_timeline, portfolio_links
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                gigId,
                req.user.id,
                coverLetter,
                proposedRate,
                proposedTimeline,
                JSON.stringify(portfolioLinks)
            ]);

            // Update applications count
            await db.run(
                'UPDATE gigs SET applications_count = applications_count + 1 WHERE id = ?',
                [gigId]
            );
        });

        res.status(201).json({
            message: 'Application submitted successfully'
        });

    } catch (error) {
        console.error('Apply to gig error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update application status (gig owner only)
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'accepted', 'rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status'
            });
        }

        // Get application and verify ownership
        const application = await database.get(`
            SELECT a.*, g.posted_by 
            FROM applications a
            LEFT JOIN gigs g ON a.gig_id = g.id
            WHERE a.id = ?
        `, [req.params.id]);

        if (!application) {
            return res.status(404).json({
                error: 'Application not found'
            });
        }

        if (application.posted_by !== req.user.id) {
            return res.status(403).json({
                error: 'Unauthorized: You can only manage applications for your own gigs'
            });
        }

        await database.run(
            'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id]
        );

        res.json({
            message: 'Application status updated successfully'
        });

    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Withdraw application (applicant only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // Get application and verify ownership
        const application = await database.get(
            'SELECT gig_id, applicant_id FROM applications WHERE id = ?',
            [req.params.id]
        );

        if (!application) {
            return res.status(404).json({
                error: 'Application not found'
            });
        }

        if (application.applicant_id !== req.user.id) {
            return res.status(403).json({
                error: 'Unauthorized: You can only withdraw your own applications'
            });
        }

        await database.transaction(async (db) => {
            // Delete application
            await db.run(
                'DELETE FROM applications WHERE id = ?',
                [req.params.id]
            );

            // Update applications count
            await db.run(
                'UPDATE gigs SET applications_count = applications_count - 1 WHERE id = ?',
                [application.gig_id]
            );
        });

        res.json({
            message: 'Application withdrawn successfully'
        });

    } catch (error) {
        console.error('Withdraw application error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;