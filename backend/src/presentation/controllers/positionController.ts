import { Request, Response } from 'express';
import { getCandidatesByPosition } from '../../application/services/positionService';

export const getCandidatesByPositionController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid position ID format' 
            });
        }

        // Parsear query parameters
        const filters: any = {};
        
        if (req.query.stage) {
            const stage = parseInt(req.query.stage as string);
            if (isNaN(stage)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid stage format'
                });
            }
            filters.stage = stage;
        }

        if (req.query.limit) {
            const limit = parseInt(req.query.limit as string);
            if (isNaN(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid limit format (must be between 1 and 100)'
                });
            }
            filters.limit = limit;
        }

        if (req.query.offset) {
            const offset = parseInt(req.query.offset as string);
            if (isNaN(offset) || offset < 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid offset format (must be >= 0)'
                });
            }
            filters.offset = offset;
        }

        const result = await getCandidatesByPosition(positionId, filters);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error: unknown) {
        console.error('Error in getCandidatesByPositionController:', error);
        
        if (error instanceof Error) {
            if (error.message === 'Position not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Position not found'
                });
            }
            
            res.status(500).json({
                success: false,
                error: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }
}; 