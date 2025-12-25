import { Router } from 'express';
import * as academicController from '../../controllers/academicController';

const router = Router();

// Student Routes
// Headers: x-mock-user-id, x-mock-role
router.get('/student/overview', academicController.getStudentOverview);
router.get('/student/subject/:subjectId', academicController.getSubjectPerformance);

// Faculty/Admin Routes
// Headers: x-mock-role
router.get('/batch/:batchId/attendance', academicController.getBatchAttendance);

// Admin Routes
router.get('/admin/analytics', academicController.getAdminAnalytics);

export default router;