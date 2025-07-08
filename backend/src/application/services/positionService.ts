import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CandidateWithStage {
    candidateId: number;
    fullName: string;
    email: string;
    currentInterviewStep: {
        id: number;
        name: string;
        orderIndex: number;
    };
    averageScore: number;
    totalInterviews: number;
    applicationDate: Date;
}

export interface PositionCandidatesResponse {
    positionId: number;
    positionTitle: string;
    candidates: CandidateWithStage[];
}

export const getPositionCandidates = async (positionId: number): Promise<PositionCandidatesResponse> => {
    try {
        // Validar que la posición existe
        const position = await prisma.position.findUnique({
            where: { id: positionId },
            select: {
                id: true,
                title: true
            }
        });

        if (!position) {
            throw new Error('Position not found');
        }

        // Obtener todas las aplicaciones para esta posición con información del candidato y etapa
        const applications = await prisma.application.findMany({
            where: { positionId: positionId },
            include: {
                candidate: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                interviewStep: {
                    select: {
                        id: true,
                        name: true,
                        orderIndex: true
                    }
                },
                interviews: {
                    select: {
                        score: true
                    }
                }
            },
            orderBy: {
                interviewStep: {
                    orderIndex: 'asc'
                }
            }
        });

        // Transformar los datos y calcular puntuaciones medias
        const candidates: CandidateWithStage[] = applications.map(application => {
            // Calcular puntuación media
            const validScores = application.interviews
                .filter(interview => interview.score !== null)
                .map(interview => interview.score!);

            const averageScore = validScores.length > 0 
                ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length 
                : 0;

            return {
                candidateId: application.candidate.id,
                fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
                email: application.candidate.email,
                currentInterviewStep: {
                    id: application.interviewStep.id,
                    name: application.interviewStep.name,
                    orderIndex: application.interviewStep.orderIndex
                },
                averageScore: Math.round(averageScore * 10) / 10, // Redondear a 1 decimal
                totalInterviews: application.interviews.length,
                applicationDate: application.applicationDate
            };
        });

        return {
            positionId: position.id,
            positionTitle: position.title,
            candidates: candidates
        };

    } catch (error: any) {
        if (error.message === 'Position not found') {
            throw new Error('Position not found');
        }
        throw new Error('Error retrieving position candidates');
    }
}; 