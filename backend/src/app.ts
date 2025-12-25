import express, { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import v1Routes from './routes/v1';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security & Middleware
app.use(helmet() as any);
app.use(cors());
app.use(express.json() as any);

// API Routes
app.use('/api/v1', v1Routes);

// Global Error Handler
app.use(errorHandler);

export default app;