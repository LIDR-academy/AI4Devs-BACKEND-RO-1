import { Request, Response } from 'express';

export const getCandidatesByPosition = async (req: Request, res: Response) => {
  const prisma = req.prisma;
  const positionId = parseInt(req.params.id);

  if (isNaN(positionId)) {
    return res.status(400).json({ message: 'Invalid position id' });
  }

  // Buscar todas las aplicaciones para la posición, incluyendo candidato
  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!applications || applications.length === 0) {
    return res.status(404).json({ message: 'No applications found for this position' });
  }

  // Obtener todos los candidateIds únicos
  const candidateIds = applications.map(app => app.candidateId);

  // Buscar todas las entrevistas de estos candidatos
  const interviews = await prisma.interview.findMany({
    where: {
      application: {
        candidateId: { in: candidateIds },
      },
      score: { not: null },
    },
    select: {
      application: { select: { candidateId: true } },
      score: true,
    },
  });

  // Calcular el promedio de score por candidato
  const scoresByCandidate: Record<number, number[]> = {};
  interviews.forEach(interview => {
    const candidateId = interview.application.candidateId;
    if (!scoresByCandidate[candidateId]) scoresByCandidate[candidateId] = [];
    if (interview.score !== null) scoresByCandidate[candidateId].push(interview.score);
  });

  // Construir la respuesta
  const result = applications.map(app => {
    const scores = scoresByCandidate[app.candidateId] || [];
    const averageScore = scores.length > 0
      ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
      : null;

    return {
      applicationId: app.id,
      fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
      currentInterviewStep: app.currentInterviewStep,
      averageScore,
    };
  });

  res.json(result);
};