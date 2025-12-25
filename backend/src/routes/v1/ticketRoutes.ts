import { Router } from 'express';
import * as ticketController from '../../controllers/ticketController';

const router = Router();

// Standard CRUD
// Headers: x-mock-user-id, x-mock-role

// POST /api/v1/tickets
// Submit a new issue
router.post('/', ticketController.createTicket);

// GET /api/v1/tickets
// Fetch all tickets, supports query params: ?buildingId=...&status=...
router.get('/', ticketController.getTickets);

// GET /api/v1/tickets/building/:buildingId
// Optimized route for map visualization
router.get('/building/:buildingId', ticketController.getBuildingIssues);

export default router;
