import { Request, Response, NextFunction } from 'express';
import * as ticketService from '../services/ticketService';

/**
 * Ticket Controller
 * Handles HTTP requests for Issues/Tickets.
 */

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).headers['x-mock-user-id'];
    if (!userId) {
        return (res as any).status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing user ID' } });
    }

    const ticketData = (req as any).body;
    
    // Pass to service layer
    const newTicket = await ticketService.createTicket(userId, ticketData);
    (res as any).status(201).json({ data: newTicket });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = (req as any).query;
    const tickets = await ticketService.getAllTickets(filters);
    (res as any).status(200).json({ data: tickets });
  } catch (error) {
    next(error);
  }
};

export const getBuildingIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { buildingId } = (req as any).params;
    const issues = await ticketService.getTicketsByBuilding(buildingId);
    (res as any).status(200).json({ data: issues });
  } catch (error) {
    next(error);
  }
};