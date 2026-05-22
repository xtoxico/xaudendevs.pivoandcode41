import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth.routes';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

app.use('/api/auth', authRouter);

export default app;
