import express from 'express';
import { CreateUser, UserLogin } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', UserLogin);

router.post('/create-user', CreateUser); 

export default router;