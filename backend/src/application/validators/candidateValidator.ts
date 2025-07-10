import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validateStageUpdateRequest = async (candidateId: number, body: any) => {
    // Validar candidateId
    if (!candidateId || isNaN(candidateId) || candidateId <= 0) {
        throw new Error('Invalid candidate ID: must be a positive number');
    }

    // Validar body
    if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body: must be an object');
    }

    const { applicationId, newInterviewStepId, notes } = body;

    // Validar applicationId
    if (!applicationId || isNaN(applicationId) || applicationId <= 0) {
        throw new Error('Invalid application ID: must be a positive number');
    }

    // Validar newInterviewStepId
    if (!newInterviewStepId || isNaN(newInterviewStepId) || newInterviewStepId <= 0) {
        throw new Error('Invalid interview step ID: must be a positive number');
    }

    // Validar notes (opcional)
    if (notes && typeof notes !== 'string') {
        throw new Error('Invalid notes: must be a string');
    }

    if (notes && notes.length > 500) {
        throw new Error('Invalid notes: must be less than 500 characters');
    }

    // Validar que la aplicación pertenece al candidato
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId,
            candidateId: candidateId
        }
    });

    if (!application) {
        throw new Error('Application not found or does not belong to this candidate');
    }

    // Validar que el newInterviewStepId es válido para la posición
    const position = await prisma.position.findFirst({
        where: {
            id: application.positionId
        },
        include: {
            interviewFlow: {
                include: {
                    interviewSteps: true
                }
            }
        }
    });

    if (!position) {
        throw new Error('Position not found');
    }

    const validStep = position.interviewFlow?.interviewSteps.find(
        step => step.id === newInterviewStepId
    );

    if (!validStep) {
        throw new Error('Invalid interview step for this position');
    }

    return true;
}; 