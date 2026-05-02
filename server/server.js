const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const winston = require('winston');
const assistantRoutes = require('./routes/assistantRoutes');
const securityRoutes = require('./routes/securityRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for Cloud Run (necessary for express-rate-limit)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://*.googleapis.com"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      frameSrc: ["'self'", "https://maps.google.com", "https://www.google.com"],
    },
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Enable Cloud Logging in production
if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_PROJECT_ID) {
  const { LoggingWinston } = require('@google-cloud/logging-winston');
  const loggingWinston = new LoggingWinston({
    projectId: process.env.GOOGLE_PROJECT_ID,
  });
  logger.add(loggingWinston);
}

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/assistant', assistantRoutes);
app.use('/api/security', securityRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
