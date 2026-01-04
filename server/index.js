import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase, createNamedConnection } from './config/db.js';

// Route imports (will be implemented)
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';

import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import uploadRoutes from './routes/upload.routes.js';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();

// Database (default + optional named connections)
// Try the configured URI; if it fails in development, attempt a local fallback.
async function initDatabases() {
  try {
    await connectDatabase(process.env.MONGO_URI);
    if (process.env.MONGO_URI_ANALYTICS) {
      await createNamedConnection('analytics', process.env.MONGO_URI_ANALYTICS);
    }
    if (process.env.MONGO_URI_LOGS) {
      await createNamedConnection('logs', process.env.MONGO_URI_LOGS);
    }
  } catch (err) {
    console.error('[db] Failed to connect using MONGO_URI:', err.message || err);
    // If running in development, try a localhost MongoDB fallback to allow local testing.
    if ((process.env.NODE_ENV || 'development') === 'development') {
      const localUri = 'mongodb://127.0.0.1:27017/aquamart';
      console.warn(`[db] Attempting local fallback MongoDB at ${localUri}`);
      try {
        await connectDatabase(localUri);
        console.warn('[db] Connected to local MongoDB fallback. Update `MONGO_URI` when ready.');
      } catch (localErr) {
        console.error('[db] Local fallback also failed:', localErr.message || localErr);
        console.error('[db] Exiting process. Please check your MongoDB URI or run a local MongoDB server.');
        process.exit(1);
      }
    } else {
      console.error('[db] In production, aborting start due to DB connection failure.');
      process.exit(1);
    }
  }
}

await initDatabases();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AquaMart API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Errors
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


