// Seed script to populate database with initial data
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database connection directly (not through the database module)
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');

// Create tables first if they don't exist
const createTables = (db) => {
  const categories = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.run(categories);
};

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database for seeding');
  createTables(db);
});

const categories = [
  { name: 'Web Development', description: 'Frontend and backend web development projects' },
  { name: 'Mobile App Development', description: 'iOS and Android mobile application development' },
  { name: 'Graphic Design', description: 'Logo design, branding, and visual content creation' },
  { name: 'Content Writing', description: 'Blog posts, articles, and copywriting services' },
  { name: 'Digital Marketing', description: 'SEO, social media marketing, and advertising campaigns' },
  { name: 'Data Analysis', description: 'Data processing, analysis, and visualization projects' },
  { name: 'Video Editing', description: 'Video production, editing, and motion graphics' },
  { name: 'UI/UX Design', description: 'User interface and user experience design projects' },
  { name: 'Translation', description: 'Document and content translation services' },
  { name: 'Virtual Assistant', description: 'Administrative and support services' }
];

const seedDatabase = () => {
  console.log('Starting database seeding...');

  // Clear existing categories and insert new ones
  db.serialize(() => {
    db.run('DELETE FROM categories', (err) => {
      if (err) {
        console.error('Error clearing categories:', err);
        return;
      }
      console.log('Cleared existing categories');
    });

    // Insert new categories
    const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
    
    categories.forEach((category, index) => {
      stmt.run(category.name, category.description, (err) => {
        if (err) {
          console.error(`Error adding category ${category.name}:`, err);
        } else {
          console.log(`Added category: ${category.name}`);
        }
        
        // Close database after last insert
        if (index === categories.length - 1) {
          stmt.finalize();
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('✅ Database seeded successfully!');
              console.log(`📊 Added ${categories.length} categories`);
              console.log('Database connection closed');
            }
          });
        }
      });
    });
  });
};

// Add a delay to let the table creation complete
setTimeout(() => {
  seedDatabase();
}, 100);