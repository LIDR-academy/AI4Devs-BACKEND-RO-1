import { Request, Response } from 'express';
import { getCandidatesByPositionId } from '../../application/services/positionService';

/**
 * Controlador para obtener los candidatos en proceso de una posición.
 */
export const getCandidatesByPositionIdController = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'El ID de la posición es inválido' });
    }
    const candidates = await getCandidatesByPositionId(positionId);
    res.json(candidates);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}; 