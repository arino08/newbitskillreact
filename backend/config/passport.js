const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const database = require('../database/database');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await database.get(
            'SELECT id, email, full_name, role, profile_picture, is_verified FROM users WHERE id = ?',
            [id]
        );
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy (commented out for development)
/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let socialLogin = await database.get(
            'SELECT * FROM user_social_logins WHERE provider = ? AND provider_id = ?',
            ['google', profile.id]
        );

        if (socialLogin) {
            // User exists, get the user data
            const user = await database.get(
                'SELECT * FROM users WHERE id = ?',
                [socialLogin.user_id]
            );
            return done(null, user);
        }

        // Check if user exists with same email
        let existingUser = await database.get(
            'SELECT * FROM users WHERE email = ?',
            [profile.emails[0].value]
        );

        let userId;

        if (existingUser) {
            // Link this Google account to existing user
            userId = existingUser.id;
        } else {
            // Create new user
            const result = await database.insert(
                `INSERT INTO users (email, full_name, profile_picture, is_verified) 
                 VALUES (?, ?, ?, ?)`,
                [
                    profile.emails[0].value,
                    profile.displayName,
                    profile.photos[0].value,
                    1 // Google accounts are pre-verified
                ]
            );
            userId = result.id;
        }

        // Create social login record
        await database.insert(
            `INSERT INTO user_social_logins (user_id, provider, provider_id, provider_data) 
             VALUES (?, ?, ?, ?)`,
            [
                userId,
                'google',
                profile.id,
                JSON.stringify({
                    accessToken,
                    refreshToken,
                    profile: profile._json
                })
            ]
        );

        // Get the complete user data
        const user = await database.get(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
    }
}));
*/

// LinkedIn OAuth Strategy (commented out for development)
/*
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this LinkedIn ID
        let socialLogin = await database.get(
            'SELECT * FROM user_social_logins WHERE provider = ? AND provider_id = ?',
            ['linkedin', profile.id]
        );

        if (socialLogin) {
            // User exists, get the user data
            const user = await database.get(
                'SELECT * FROM users WHERE id = ?',
                [socialLogin.user_id]
            );
            return done(null, user);
        }

        // Check if user exists with same email
        let existingUser = await database.get(
            'SELECT * FROM users WHERE email = ?',
            [profile.emails[0].value]
        );

        let userId;

        if (existingUser) {
            // Link this LinkedIn account to existing user
            userId = existingUser.id;
        } else {
            // Create new user
            const result = await database.insert(
                `INSERT INTO users (email, full_name, profile_picture, is_verified) 
                 VALUES (?, ?, ?, ?)`,
                [
                    profile.emails[0].value,
                    profile.displayName,
                    profile.photos[0].value,
                    1 // LinkedIn accounts are pre-verified
                ]
            );
            userId = result.id;
        }

        // Create social login record
        await database.insert(
            `INSERT INTO user_social_logins (user_id, provider, provider_id, provider_data) 
             VALUES (?, ?, ?, ?)`,
            [
                userId,
                'linkedin',
                profile.id,
                JSON.stringify({
                    accessToken,
                    refreshToken,
                    profile: profile._json
                })
            ]
        );

        // Get the complete user data
        const user = await database.get(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );

        done(null, user);
    } catch (error) {
        console.error('LinkedIn OAuth error:', error);
        done(error, null);
    }
}));
*/

module.exports = passport;