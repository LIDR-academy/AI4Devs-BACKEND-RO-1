import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesByPosition = async (req: Request, res: Response) => {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
        return res.status(400).json({ error: 'Invalid position ID format' });
    }
    // Verificar existencia de la posición
    const position = await prisma.position.findUnique({ where: { id: positionId } });
    if (!position) {
        return res.status(404).json({ error: 'Position not found' });
    }
    // Buscar applications asociadas a la posición, incluyendo candidato y entrevistas
    const applications = await prisma.application.findMany({
        where: { positionId },
        include: {
            candidate: true,
            interviews: true,
        },
    });
    // Mapear resultados
    const candidates = applications.map(app => {
        const fullName = `${app.candidate.firstName} ${app.candidate.lastName}`;
        const currentInterviewStep = app.currentInterviewStep;
        // Calcular puntuación media
        let avgScore = null;
        if (app.interviews.length > 0) {
            const scores = app.interviews
                .map(i => i.score)
                .filter((score): score is number => typeof score === 'number');
            if (scores.length > 0) {
                avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
        }
        return {
            fullName,
            currentInterviewStep,
            averageScore: avgScore,
        };
    });
    return res.json({ candidates });
}; 