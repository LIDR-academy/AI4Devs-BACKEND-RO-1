import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CandidatePositionData {
    applicationId: number;
    candidateId: number;
    fullName: string;
    email: string;
    currentInterviewStep: {
        id: number;
        name: string;
        orderIndex: number;
        interviewType: string;
    };
    averageScore: number;
    applicationDate: string;
    interviewsCompleted: number;
    totalInterviews: number;
    lastUpdated: string;
}

export interface StageInfo {
    id: number;
    name: string;
    orderIndex: number;
    candidateCount: number;
}

export interface CandidateFilters {
    stage?: number;
    limit?: number;
    offset?: number;
}

export const getCandidatesByPosition = async (
    positionId: number, 
    filters: CandidateFilters = {}
): Promise<{
    position: any;
    candidates: CandidatePositionData[];
    stages: StageInfo[];
    totalCandidates: number;
}> => {
    // Verificar que la posición existe
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        include: {
            company: true,
            interviewFlow: {
                include: {
                    interviewSteps: {
                        include: {
                            interviewType: true
                        },
                        orderBy: { orderIndex: 'asc' }
                    }
                }
            }
        }
    });

    if (!position) {
        throw new Error('Position not found');
    }

    // Construir filtros para la consulta
    const whereConditions: any = {
        positionId: positionId
    };

    if (filters.stage) {
        whereConditions.currentInterviewStep = filters.stage;
    }

    // Obtener aplicaciones con datos relacionados
    const applications = await prisma.application.findMany({
        where: whereConditions,
        include: {
            candidate: true,
            interviewStep: {
                include: {
                    interviewType: true
                }
            },
            interviews: {
                where: { score: { not: null } },
                select: { score: true }
            }
        },
        orderBy: { applicationDate: 'desc' },
        skip: filters.offset || 0,
        take: filters.limit || 50
    });

    // Transformar datos para la respuesta
    const candidates: CandidatePositionData[] = await Promise.all(
        applications.map(async (app) => {
            // Calcular puntuación media
            const scores = app.interviews.map(i => i.score).filter(s => s !== null) as number[];
            const averageScore = scores.length > 0 
                ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1))
                : 0;

            // Contar entrevistas completadas
            const interviewsCompleted = await prisma.interview.count({
                where: {
                    applicationId: app.id,
                    result: { not: null }
                }
            });

            // Total de entrevistas en el flujo
            const totalInterviews = position.interviewFlow?.interviewSteps.length || 0;

            return {
                applicationId: app.id,
                candidateId: app.candidateId,
                fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
                email: app.candidate.email,
                currentInterviewStep: {
                    id: app.interviewStep.id,
                    name: app.interviewStep.name,
                    orderIndex: app.interviewStep.orderIndex,
                    interviewType: app.interviewStep.interviewType.name
                },
                averageScore,
                applicationDate: app.applicationDate.toISOString(),
                interviewsCompleted,
                totalInterviews,
                lastUpdated: new Date().toISOString()
            };
        })
    );

    // Obtener información de etapas con conteo de candidatos
    const stages: StageInfo[] = await Promise.all(
        (position.interviewFlow?.interviewSteps || []).map(async (step) => {
            const candidateCount = await prisma.application.count({
                where: {
                    positionId: positionId,
                    currentInterviewStep: step.id
                }
            });

            return {
                id: step.id,
                name: step.name,
                orderIndex: step.orderIndex,
                candidateCount
            };
        })
    );

    // Contar total de candidatos para esta posición
    const totalCandidates = await prisma.application.count({
        where: { positionId: positionId }
    });

    return {
        position: {
            id: position.id,
            title: position.title,
            company: position.company.name
        },
        candidates,
        stages,
        totalCandidates
    };
}; 