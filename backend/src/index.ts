import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running! New text');
});

app.get('/check', (req: Request, res: Response) => {
  res.send('Finally Worked');
});

app.get('/test', (req: Request, res: Response) => {
  res.send('Testing');
});



export default app;