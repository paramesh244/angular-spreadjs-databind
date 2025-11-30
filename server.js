const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.post('/api/save-columns', (req, res) => {
  const { selectedColumns, rows } = req.body;
  
  console.log('=== Save Selected Columns ===');
  console.log('Selected Columns:', selectedColumns);
  console.log('Number of rows:', rows?.length || 0);
  console.log('Sample data:', rows?.slice(0, 2));
  console.log('============================\n');

  setTimeout(() => {
    res.json({
      success: true,
      savedCount: rows?.length || 0
    });
  }, 500);
});


app.post('/api/save-all', (req, res) => {
  const { rows } = req.body;
  
  console.log('=== Save All Data ===');
  console.log('Number of rows:', rows?.length || 0);
  console.log('Sample data:', rows?.slice(0, 2));
  console.log('====================\n');

  setTimeout(() => {
    res.json({
      success: true,
      savedCount: rows?.length || 0
    });
  }, 500);
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
});
