import { Router } from 'express';
import authRoutes from './authRoutes';
import ticketRoutes from './ticketRoutes';
import academicRoutes from './academicRoutes';

const router = Router();

// Domain Routes
router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/academics', academicRoutes);

export default router;
