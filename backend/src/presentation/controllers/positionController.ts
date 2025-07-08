import { Request, Response } from 'express';
import { getCandidatesByPosition } from '../../application/services/positionService';

// GET /positions/:id/candidates
export const getCandidatesByPositionController = async (req: Request, res: Response) => {
  const positionId = parseInt(req.params.id);
  if (isNaN(positionId)) {
    return res.status(400).json({ error: 'Invalid position ID' });
  }
  try {
    const candidates = await getCandidatesByPosition(positionId);
    return res.json(candidates);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 