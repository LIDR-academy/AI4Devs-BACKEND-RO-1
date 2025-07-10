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
        const { positionId, new_stage } = req.body;
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'El ID del candidato es inválido' });
        }
        if (!positionId || isNaN(Number(positionId))) {
            return res.status(400).json({ error: 'El ID de la posición es inválido' });
        }
        if (!new_stage || isNaN(Number(new_stage))) {
            return res.status(400).json({ error: 'La nueva etapa es inválida' });
        }
        const updated = await updateCandidateStage(candidateId, Number(positionId), Number(new_stage));
        res.json({
            message: 'Etapa actualizada correctamente',
            applicationId: updated.id,
            candidateId: updated.candidateId,
            current_interview_step: updated.currentInterviewStep
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error al actualizar la etapa' });
    }
};

export { addCandidate };