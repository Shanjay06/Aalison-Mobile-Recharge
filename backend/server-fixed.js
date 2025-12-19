require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnection = require('./config/database');
const User = require('./models/User');
const Plan = require('./models/Plan');

const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Health check route (works without DB)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Aalison Recharge API Server is running!', 
    version: '1.0.0',
    database: dbConnection.isReady() ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbConnection.isReady(),
    timestamp: new Date().toISOString()
  });
});

// Apply DB connection middleware to all API routes
app.use('/api/auth', dbConnection.requireConnection());
app.use('/api/users', dbConnection.requireConnection());
app.use('/api/transactions', dbConnection.requireConnection());
app.use('/api/plans', dbConnection.requireConnection());
app.use('/api/admin', dbConnection.requireConnection());

// Load routes after middleware
const loadRoutes = () => {
  try {
    app.use('/api/auth', require('./routes/auth'));
    console.log('✅ Auth routes loaded');
  } catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
  }

  try {
    app.use('/api/users', require('./routes/users'));
    console.log('✅ User routes loaded');
  } catch (error) {
    console.error('❌ Error loading user routes:', error.message);
  }

  try {
    app.use('/api/transactions', require('./routes/transactions'));
    console.log('✅ Transaction routes loaded');
  } catch (error) {
    console.error('❌ Error loading transaction routes:', error.message);
  }

  try {
    app.use('/api/plans', require('./routes/plans'));
    console.log('✅ Plan routes loaded');
  } catch (error) {
    console.error('❌ Error loading plan routes:', error.message);
  }

  try {
    app.use('/api/admin', require('./routes/admin'));
    console.log('✅ Admin routes loaded');
  } catch (error) {
    console.error('❌ Error loading admin routes:', error.message);
  }
};

// Initialize default data only after DB connection
const initializeData = async () => {
  try {
    console.log('🔄 Initializing default data...');
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Administrator',
        email: 'admin@aalison.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default admin created');
    }

    const plansCount = await Plan.countDocuments();
    if (plansCount === 0) {
      await Plan.insertMany([
        { operator: 'All', amount: 99, validity: '28 days', data: '1.5GB/day', description: 'Basic Plan' },
        { operator: 'All', amount: 199, validity: '56 days', data: '2GB/day', description: 'Popular Plan' },
        { operator: 'All', amount: 399, validity: '84 days', data: '3GB/day', description: 'Premium Plan' },
        { operator: 'All', amount: 599, validity: '365 days', data: '2GB/day', description: 'Annual Plan' }
      ]);
      console.log('✅ Default plans created');
    }
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Server startup sequence
const startServer = async () => {
  try {
    console.log('🚀 Starting Aalison Recharge Server...');
    
    // Step 1: Connect to MongoDB first
    await dbConnection.connect();
    
    // Step 2: Load routes after DB connection
    loadRoutes();
    
    // Step 3: Initialize default data
    await initializeData();
    
    // Step 4: Start Express server only after everything is ready
    const PORT = process.env.PORT || 8000;
    
    app.listen(PORT, () => {
      console.log(`🎉 Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}`);
      console.log('✅ All systems operational');
    });
    
  } catch (error) {
    console.error('💥 Server startup failed:', error.message);
    console.error('🔧 Please check your MongoDB connection and try again');
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Start the server
startServer();