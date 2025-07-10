import { PrismaClient } from '@prisma/client';

const defaultPrisma = new PrismaClient();

/**
 * Obtiene todos los candidatos en proceso para una posición específica.
 * @param positionId ID de la posición
 * @param prisma Instancia de PrismaClient (opcional, para testing)
 * @returns Array de candidatos con nombre completo, etapa actual y puntuación media
 */
export const getCandidatesByPositionId = async (positionId: number, prisma: PrismaClient = defaultPrisma) => {
  // Validación básica
  if (!positionId || isNaN(positionId)) {
    throw new Error('El ID de la posición es inválido');
  }

  // Consulta optimizada usando Prisma
  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: true,
      interviews: true,
    },
  });

  // Mapear resultados al formato requerido
  return applications.map(app => {
    const fullName = `${app.candidate.firstName} ${app.candidate.lastName}`;
    const current_interview_step = app.currentInterviewStep;
    const scores = app.interviews
      .map(i => i.score)
      .filter((s): s is number => typeof s === 'number' && s !== null);
    const average_score = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;
    return {
      candidateId: app.candidateId,
      fullName,
      current_interview_step,
      average_score,
    };
  });
}; 