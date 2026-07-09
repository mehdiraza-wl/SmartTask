import express from 'express';
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import projectRouter from './routes/project.route.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js';
import passport from './configs/passport.js';
const app = express();


app.use(passport.initialize())

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/projects', projectRouter)

app.use(errorHandler);

export default app;