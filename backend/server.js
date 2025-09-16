import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './src/db/db.js';
import userRouter from './src/routes/user.routes.js';
import projectRouter from './src/routes/project.routes.js';
// import { connectAndLog } from './src/db/db.js';

dotenv.config();

connectDB();
// connectAndLog();
// runTestQuery
// hkkjhgfhg
const app = express();

// asdfghjklyt

// Enable CORS for all routess
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
