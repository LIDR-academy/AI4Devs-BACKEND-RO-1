import { Request, Response } from 'express';
import { getPositionCandidates } from '../../application/services/positionService';

export const getPositionCandidatesController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        
        // Validar que el ID es un número válido
        if (isNaN(positionId) || positionId <= 0) {
            return res.status(400).json({ 
                error: 'Invalid position ID. Must be a positive integer.' 
            });
        }

        const result = await getPositionCandidates(positionId);
        
        res.status(200).json(result);
        
    } catch (error: any) {
        if (error.message === 'Position not found') {
            return res.status(404).json({ 
                error: 'Position not found' 
            });
        }
        
        console.error('Error in getPositionCandidatesController:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
}; 