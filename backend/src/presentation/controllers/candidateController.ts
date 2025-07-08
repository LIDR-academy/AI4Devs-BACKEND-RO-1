export { addCandidate };
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';

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


// GET /positions/:id/candidates
export const getCandidatesByPosition = async (req: Request, res: Response) => {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
        return res.status(400).json({ error: 'Invalid position ID' });
    }
    const prisma = new PrismaClient();
    try {
        // Check if position exists
        const position = await prisma.position.findUnique({ where: { id: positionId } });
        if (!position) {
            return res.status(404).json({ error: 'Position not found' });
        }

        // Get all applications for this position, including candidate and interviews
        const applications = await prisma.application.findMany({
            where: { positionId },
            include: {
                candidate: true,
                interviewStep: true,
                interviews: true
            }
        });

        const candidates = applications.map((app: any) => {
            // Calculate average score from completed interviews
            const completedInterviews = app.interviews.filter((i: any) => i.score !== null && i.score !== undefined);
            const average_score = completedInterviews.length > 0
                ? completedInterviews.reduce((sum: number, i: any) => sum + i.score, 0) / completedInterviews.length
                : null;
            return {
                candidate_id: app.candidate.id,
                full_name: app.candidate.firstName + ' ' + app.candidate.lastName,
                current_interview_step: app.interviewStep ? app.interviewStep.name : null,
                average_score,
                application_id: app.id
            };
        });

        return res.json({
            position_id: positionId,
            candidates
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

// PUT /candidates/:id/stage
export const updateCandidateStage = async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.id);
    const { new_stage } = req.body;
    if (isNaN(candidateId) || !new_stage) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const prisma = new PrismaClient();
    try {
        // Find the candidate's active application
        const application = await prisma.application.findFirst({
            where: { candidateId },
            orderBy: { applicationDate: 'desc' },
        });
        if (!application) {
            return res.status(404).json({ error: 'Active application not found for candidate' });
        }

        // Find the interview step by name
        const interviewStep = await prisma.interviewStep.findFirst({ where: { name: new_stage } });
        if (!interviewStep) {
            return res.status(400).json({ error: 'Invalid stage value' });
        }

        // Update the application's currentInterviewStep
        const updated = await prisma.application.update({
            where: { id: application.id },
            data: { currentInterviewStep: interviewStep.id },
        });

        return res.json({
            success: true,
            candidate_id: candidateId,
            previous_stage: application.currentInterviewStep,
            new_stage,
            updated_at: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};