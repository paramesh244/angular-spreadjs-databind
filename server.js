const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint for saving selected columns
app.post('/api/save-columns', (req, res) => {
  const { selectedColumns, rows } = req.body;
  
  console.log('=== Save Selected Columns ===');
  console.log('Selected Columns:', selectedColumns);
  console.log('Number of rows:', rows?.length || 0);
  console.log('Sample data:', rows?.slice(0, 2));
  console.log('============================\n');
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      savedCount: rows?.length || 0
    });
  }, 500);
});

// POST endpoint for saving all data
app.post('/api/save-all', (req, res) => {
  const { rows } = req.body;
  
  console.log('=== Save All Data ===');
  console.log('Number of rows:', rows?.length || 0);
  console.log('Sample data:', rows?.slice(0, 2));
  console.log('====================\n');
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      savedCount: rows?.length || 0
    });
  }, 500);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock backend server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available:`);
  console.log(`   - POST http://localhost:${PORT}/api/save-columns`);
  console.log(`   - POST http://localhost:${PORT}/api/save-all`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
});
