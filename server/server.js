const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const assistantRoutes = require('./routes/assistantRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/assistant', assistantRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // Fallback for dev without built frontend
  app.get('/', (req, res) => {
    res.send('API is running. Please run frontend separately in dev mode.');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
