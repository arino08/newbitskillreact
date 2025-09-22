-- Users table for storing user accounts
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT, -- NULL for social login users
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'freelancer', 'employer')),
    profile_picture TEXT,
    bio TEXT,
    skills TEXT, -- JSON array of skills
    location TEXT,
    website TEXT,
    phone TEXT,
    is_verified BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Social login providers table
CREATE TABLE IF NOT EXISTS user_social_logins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'linkedin')),
    provider_id TEXT NOT NULL,
    provider_data TEXT, -- JSON data from provider
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(provider, provider_id)
);

-- Categories for gigs
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gigs table for job/project postings
CREATE TABLE IF NOT EXISTS gigs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER,
    posted_by INTEGER NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    budget_type TEXT DEFAULT 'fixed' CHECK (budget_type IN ('fixed', 'hourly')),
    deadline DATE,
    duration_estimate TEXT,
    difficulty_level TEXT DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'expert')),
    required_skills TEXT, -- JSON array of required skills
    remote_allowed BOOLEAN DEFAULT 1,
    location TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled', 'closed')),
    applications_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    is_urgent BOOLEAN DEFAULT 0,
    attachments TEXT, -- JSON array of attachment URLs
    tags TEXT, -- JSON array of tags
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (posted_by) REFERENCES users (id) ON DELETE CASCADE
);

-- Applications table for gig applications
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gig_id INTEGER NOT NULL,
    applicant_id INTEGER NOT NULL,
    cover_letter TEXT,
    proposed_rate DECIMAL(10,2),
    proposed_timeline TEXT,
    portfolio_links TEXT, -- JSON array of portfolio links
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gig_id) REFERENCES gigs (id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(gig_id, applicant_id)
);

-- Messages table for communication between users
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    gig_id INTEGER, -- Optional: related to a specific gig
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (gig_id) REFERENCES gigs (id) ON DELETE SET NULL
);

-- Reviews and ratings table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gig_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    reviewee_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_public BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gig_id) REFERENCES gigs (id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(gig_id, reviewer_id, reviewee_id)
);

-- User sessions table for JWT token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Favorites/bookmarks table
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    gig_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (gig_id) REFERENCES gigs (id) ON DELETE CASCADE,
    UNIQUE(user_id, gig_id)
);

-- Insert default categories
INSERT OR IGNORE INTO categories (name, description, icon, color) VALUES
('Web Development', 'Frontend, backend, and full-stack web development', 'fas fa-code', '#3b82f6'),
('Mobile Development', 'iOS and Android app development', 'fas fa-mobile-alt', '#10b981'),
('Design & Creative', 'UI/UX design, graphic design, branding', 'fas fa-palette', '#f59e0b'),
('Digital Marketing', 'SEO, social media, content marketing', 'fas fa-bullhorn', '#ef4444'),
('Writing & Translation', 'Content writing, copywriting, translation', 'fas fa-pen', '#8b5cf6'),
('Data & Analytics', 'Data analysis, machine learning, AI', 'fas fa-chart-bar', '#06b6d4'),
('Consulting', 'Business consulting, strategy, coaching', 'fas fa-handshake', '#84cc16'),
('Photography & Video', 'Photography, videography, editing', 'fas fa-camera', '#f97316');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category_id);
CREATE INDEX IF NOT EXISTS idx_gigs_posted_by ON gigs(posted_by);
CREATE INDEX IF NOT EXISTS idx_gigs_created_at ON gigs(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_gig_id ON applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);