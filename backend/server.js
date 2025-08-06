import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './src/db/db.js';
import authRouter from './src/routes/auth.routes.js';
import projectRouter from './src/routes/project.routes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api', projectRouter);


app.get('/', async (req, res) => {
  res.send('API is running!');
});


const PORT = 5000

http://localhost:5000/api/projects

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
