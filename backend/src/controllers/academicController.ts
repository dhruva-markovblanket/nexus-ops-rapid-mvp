import { Request, Response, NextFunction } from 'express';
import * as academicService from '../services/academicService';

/**
 * Academic Controller
 * Handles request parsing, header extraction (for mock auth), and response formatting.
 */

export const getStudentOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = (req as any).headers['x-mock-user-id'] as string;
    const role = (req as any).headers['x-mock-role'] as string;

    if (!studentId) {
       return (res as any).status(400).json({ error: 'Missing x-mock-user-id header' });
    }

    const overview = await academicService.fetchStudentOverview(studentId);
    (res as any).json(overview);
  } catch (error) {
    next(error);
  }
};

export const getSubjectPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = (req as any).headers['x-mock-user-id'] as string;
    const { subjectId } = (req as any).params;

    if (!studentId) {
       return (res as any).status(400).json({ error: 'Missing x-mock-user-id header' });
    }

    const performance = await academicService.fetchSubjectPerformance(studentId, subjectId);
    (res as any).json(performance);
  } catch (error) {
    next(error);
  }
};

export const getBatchAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { batchId } = (req as any).params;
    // Real app would verify role here
    const summary = await academicService.fetchBatchAttendance(batchId);
    (res as any).json(summary);
  } catch (error) {
    next(error);
  }
};

export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await academicService.fetchUniversityAnalytics();
    (res as any).json(analytics);
  } catch (error) {
    next(error);
  }
};