import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UpdateStageRequest {
    interviewStepId: number;
    notes?: string;
}

export interface UpdateStageResponse {
    candidateId: number;
    fullName: string;
    email: string;
    updatedInterviewStep: {
        id: number;
        name: string;
        orderIndex: number;
    };
    previousInterviewStep: {
        id: number;
        name: string;
        orderIndex: number;
    };
    updatedAt: Date;
    notes?: string;
}

export const updateCandidateStage = async (candidateId: number, updateData: UpdateStageRequest): Promise<UpdateStageResponse> => {
    try {
        // Validar que el candidato existe y tiene una aplicación activa
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: {
                applications: {
                    include: {
                        position: {
                            include: {
                                interviewFlow: {
                                    include: {
                                        interviewSteps: true
                                    }
                                }
                            }
                        },
                        interviewStep: true
                    }
                }
            }
        });

        if (!candidate) {
            throw new Error('Candidate not found');
        }

        // Buscar aplicación activa para este candidato
        const activeApplication = candidate.applications.find(app => 
            app.position && app.interviewStep
        );

        if (!activeApplication) {
            throw new Error('No active application found');
        }

        // Validar que la nueva etapa pertenece al flujo de entrevista de la posición
        const validSteps = activeApplication.position.interviewFlow.interviewSteps;
        const newStep = validSteps.find(step => step.id === updateData.interviewStepId);

        if (!newStep) {
            throw new Error('Invalid interview stage for this position');
        }

        // Validar que no se está moviendo a una etapa anterior (solo hacia adelante)
        const currentStepOrder = activeApplication.interviewStep.orderIndex;
        const newStepOrder = newStep.orderIndex;

        if (newStepOrder < currentStepOrder) {
            throw new Error('Cannot move candidate to a previous stage');
        }

        // Guardar la etapa anterior para la respuesta
        const previousInterviewStep = {
            id: activeApplication.interviewStep.id,
            name: activeApplication.interviewStep.name,
            orderIndex: activeApplication.interviewStep.orderIndex
        };

        // Actualizar la etapa del candidato
        const updatedApplication = await prisma.application.update({
            where: { id: activeApplication.id },
            data: {
                currentInterviewStep: updateData.interviewStepId,
                notes: updateData.notes || activeApplication.notes
            },
            include: {
                interviewStep: true,
                candidate: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return {
            candidateId: updatedApplication.candidate.id,
            fullName: `${updatedApplication.candidate.firstName} ${updatedApplication.candidate.lastName}`,
            email: updatedApplication.candidate.email,
            updatedInterviewStep: {
                id: updatedApplication.interviewStep.id,
                name: updatedApplication.interviewStep.name,
                orderIndex: updatedApplication.interviewStep.orderIndex
            },
            previousInterviewStep: previousInterviewStep,
            updatedAt: new Date(),
            notes: updateData.notes
        };

    } catch (error: any) {
        if (error.message === 'Candidate not found') {
            throw new Error('Candidate not found');
        }
        if (error.message === 'No active application found') {
            throw new Error('No active application found');
        }
        if (error.message === 'Invalid interview stage for this position') {
            throw new Error('Invalid interview stage for this position');
        }
        if (error.message === 'Cannot move candidate to a previous stage') {
            throw new Error('Cannot move candidate to a previous stage');
        }
        throw new Error('Error updating candidate stage');
    }
}; 