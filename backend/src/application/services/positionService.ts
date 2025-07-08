import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CandidateSummary {
  fullName: string;
  current_interview_step: number;
  average_score: number | null;
}

export const getCandidatesByPosition = async (positionId: number): Promise<CandidateSummary[]> => {
  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: true,
      interviews: true,
    },
  });
  return applications.map(app => {
    const scores = app.interviews.map(i => i.score).filter((s): s is number => s !== null);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    return {
      fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
      current_interview_step: app.currentInterviewStep,
      average_score: avgScore,
    };
  });
}; 