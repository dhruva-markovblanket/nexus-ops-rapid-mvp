import api from './api';
import { Ticket } from '../types'; 

// Define the shape of the data needed to create a ticket
interface CreateTicketDTO {
  title: string;
  description: string;
  location: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  buildingId?: string; // Optional linkage to infrastructure
  coordinates?: { x: number; y: number; z?: number };
}

/**
 * Submits a new issue to the backend.
 */
export const submitIssue = async (data: CreateTicketDTO, userId: string): Promise<Ticket> => {
  const response = await api.post('/tickets', data, {
    headers: {
      'x-mock-user-id': userId
    }
  });
  return response.data.data;
};

/**
 * Fetches all issues, optionally filtered by building.
 */
export const fetchIssues = async (userId: string, filters?: { buildingId?: string, status?: string }): Promise<Ticket[]> => {
  const params = new URLSearchParams();
  if (filters?.buildingId) params.append('buildingId', filters.buildingId);
  if (filters?.status) params.append('status', filters.status);

  const response = await api.get(`/tickets?${params.toString()}`, {
    headers: {
      'x-mock-user-id': userId
    }
  });
  return response.data.data;
};