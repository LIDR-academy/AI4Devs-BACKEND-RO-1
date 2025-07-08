import { Request, Response } from 'express';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';
import { updateCandidateStage } from '../../application/services/candidateStageService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        
        // Validar que el ID es un número válido
        if (isNaN(candidateId) || candidateId <= 0) {
            return res.status(400).json({ 
                error: 'Invalid candidate ID. Must be a positive integer.' 
            });
        }

        const { interviewStepId, notes } = req.body;

        // Validar que interviewStepId está presente y es válido
        if (!interviewStepId || isNaN(interviewStepId) || interviewStepId <= 0) {
            return res.status(400).json({ 
                error: 'Invalid interviewStepId. Must be a positive integer.' 
            });
        }

        // Validar longitud de notas si se proporciona
        if (notes && typeof notes === 'string' && notes.length > 500) {
            return res.status(400).json({ 
                error: 'Notes too long. Maximum 500 characters allowed.' 
            });
        }

        const result = await updateCandidateStage(candidateId, { interviewStepId, notes });
        
        res.status(200).json(result);
        
    } catch (error: any) {
        if (error.message === 'Candidate not found') {
            return res.status(404).json({ 
                error: 'Candidate not found' 
            });
        }
        if (error.message === 'No active application found') {
            return res.status(400).json({ 
                error: 'No active application found' 
            });
        }
        if (error.message === 'Invalid interview stage for this position') {
            return res.status(400).json({ 
                error: 'Invalid interview stage for this position' 
            });
        }
        if (error.message === 'Cannot move candidate to a previous stage') {
            return res.status(400).json({ 
                error: 'Cannot move candidate to a previous stage' 
            });
        }
        
        console.error('Error in updateCandidateStageController:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

export { addCandidate };