import { pool } from '../config/database';

export const create = async (ticket: any) => {
  const query = `
    INSERT INTO issues (
        title, description, building_id, floor_number, 
        specific_location, map_coordinates, severity, category, created_by, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'SUBMITTED')
    RETURNING *;
  `;
  const values = [
    ticket.title, 
    ticket.description, 
    ticket.buildingId,
    ticket.floorNumber || 0,
    ticket.location, // specific_location
    ticket.coordinates, 
    ticket.priority, // severity
    ticket.category, 
    ticket.created_by
  ];
  
  // NOTE: In a real environment with the DB running, we would execute this.
  // For this demo environment without a live DB, we return the mock object + ID.
  // const { rows } = await pool.query(query, values);
  // return rows[0];
  
  return { 
      id: `issue-${Date.now()}`,
      ...ticket,
      status: 'SUBMITTED',
      created_at: new Date() 
  };
};

export const findAll = async (filters: any) => {
  let query = `
    SELECT i.*, b.name as building_name
    FROM issues i
    LEFT JOIN buildings b ON i.building_id = b.id
    WHERE 1=1
  `;
  
  const values: any[] = [];
  
  if (filters.buildingId) {
      values.push(filters.buildingId);
      query += ` AND i.building_id = $${values.length}`;
  }
  
  if (filters.status) {
      values.push(filters.status);
      query += ` AND i.status = $${values.length}`;
  }

  query += ` ORDER BY i.created_at DESC`;

  // const { rows } = await pool.query(query, values);
  // return rows;

  return []; // Return empty mock array
};
