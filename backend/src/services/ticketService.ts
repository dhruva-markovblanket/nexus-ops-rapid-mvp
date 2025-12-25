import * as ticketModel from '../models/ticketModel';
import { TicketStatus } from '../types/ticketTypes';

// Mock types for demonstration if file doesn't exist
interface TicketData {
    title: string;
    description: string;
    location: string;
    priority: string;
    category: string;
    buildingId?: string;
    coordinates?: any;
}

export const createTicket = async (userId: string, data: TicketData) => {
  // Business Logic:
  // 1. Validate severity level based on category?
  // 2. Check if user is spamming?
  
  return await ticketModel.create({
    ...data,
    created_by: userId,
    status: TicketStatus.PENDING
  });
};

export const getAllTickets = async (filters: any) => {
  return await ticketModel.findAll(filters);
};

export const getTicketsByBuilding = async (buildingId: string) => {
    // Specialized query for map pins
    return await ticketModel.findAll({ buildingId });
};
