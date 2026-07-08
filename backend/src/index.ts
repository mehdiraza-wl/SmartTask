import express from 'express';
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js';
const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.use(errorHandler);

export default app;