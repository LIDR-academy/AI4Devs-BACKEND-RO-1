import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

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
        if (isNaN(candidateId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid candidate ID format'
            });
        }

        // Validar body
        const { applicationId, newInterviewStepId, notes } = req.body;
        
        if (!applicationId || !newInterviewStepId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: applicationId and newInterviewStepId'
            });
        }

        if (isNaN(applicationId) || isNaN(newInterviewStepId)) {
            return res.status(400).json({
                success: false,
                error: 'applicationId and newInterviewStepId must be numbers'
            });
        }

        const stageData = {
            applicationId: parseInt(applicationId),
            newInterviewStepId: parseInt(newInterviewStepId),
            notes: notes || undefined
        };

        const result = await updateCandidateStage(candidateId, stageData);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error: unknown) {
        console.error('Error in updateCandidateStageController:', error);
        
        if (error instanceof Error) {
            if (error.message === 'Candidate not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Candidate not found'
                });
            }
            
            if (error.message === 'Application not found or does not belong to this candidate') {
                return res.status(404).json({
                    success: false,
                    error: 'Application not found or does not belong to this candidate'
                });
            }
            
            if (error.message === 'Invalid interview step for this position') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid interview step for this position'
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

export { addCandidate };