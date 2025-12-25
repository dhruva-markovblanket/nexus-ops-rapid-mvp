import app from './app';
import { pool } from './config/database';

const PORT = process.env.PORT || 3000;

// Test DB connection before starting server
pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });
