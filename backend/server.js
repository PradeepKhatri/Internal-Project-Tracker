import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './src/db/db.js';
import userRouter from './src/routes/user.routes.js';
import projectRouter from './src/routes/project.routes.js';

dotenv.config();

connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.use('/api/auth', userRouter);

app.use('/api', projectRouter);

app.get('/', async (req, res) => {
  res.send('API is running!');
});

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
