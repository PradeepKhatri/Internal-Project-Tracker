import express from 'express';
import { getLatestAnnouncement, publishAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller.js';
import { authenticate } from '../middlewares/user.middleware.js';
import { superadminMiddleware } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/latest', authenticate, getLatestAnnouncement);
router.post('/', authenticate, superadminMiddleware, publishAnnouncement);
router.delete('/', authenticate, superadminMiddleware, deleteAnnouncement);

export default router;