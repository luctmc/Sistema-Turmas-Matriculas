import { Router } from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import studentRoutes from './studentRoutes.js';
import classRoutes from './classRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/enrollments', enrollmentRoutes);

export default router;
