import express from 'express';
import { 
  CreateUser, 
  GetMyProfile, 
  GetUsers, 
  GetUserById,   
  UpdatePassword, 
  UpdateUserRole, 
  UserLogin,
  DeleteUser
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/user.middleware.js';
import { superadminMiddleware } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/login', UserLogin);

router.post('/create-user', authenticate, superadminMiddleware, CreateUser); 

router.patch('/me/password', authenticate, UpdatePassword);

router.patch('/:userId/role', authenticate, superadminMiddleware, UpdateUserRole);

router.get('/users', authenticate, GetUsers);

router.get('/users/:userId', authenticate, GetUserById);

router.get('/me', authenticate, GetMyProfile);

router.delete('/users/:id', authenticate, superadminMiddleware, DeleteUser);

export default router;