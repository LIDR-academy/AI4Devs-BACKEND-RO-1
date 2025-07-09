import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';

const prisma = new PrismaClient();

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

export const updateCandidateStage = async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.id);
    const { positionId, currentInterviewStep } = req.body;

    if (isNaN(candidateId) || !positionId || !currentInterviewStep) {
        return res.status(400).json({ error: 'Invalid candidateId, positionId or currentInterviewStep' });
    }

    // Validar existencia de candidato
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
    }
    // Validar existencia de posición
    const position = await prisma.position.findUnique({ where: { id: positionId } });
    if (!position) {
        return res.status(404).json({ error: 'Position not found' });
    }
    // Buscar application
    const application = await prisma.application.findFirst({
        where: { candidateId, positionId }
    });
    if (!application) {
        return res.status(404).json({ error: 'Application not found for this candidate and position' });
    }
    // Actualizar el stage
    const updated = await prisma.application.update({
        where: { id: application.id },
        data: { currentInterviewStep }
    });
    return res.json({ message: 'Interview step updated', application: updated });
};

export { addCandidate };