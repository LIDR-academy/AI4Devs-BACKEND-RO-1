import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { Application } from '../../domain/models/Application';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface StageUpdateRequest {
    applicationId: number;
    newInterviewStepId: number;
    notes?: string;
}

export interface StageUpdateResult {
    applicationId: number;
    candidateId: number;
    previousStep: {
        id: number;
        name: string;
    };
    currentStep: {
        id: number;
        name: string;
    };
    updatedAt: string;
}

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

export const updateCandidateStage = async (
    candidateId: number,
    stageData: StageUpdateRequest
): Promise<StageUpdateResult> => {
    try {
        // Verificar que el candidato existe
        const candidate = await Candidate.findOne(candidateId);
        if (!candidate) {
            throw new Error('Candidate not found');
        }

        // Verificar que la aplicación existe y pertenece al candidato
        const application = await prisma.application.findFirst({
            where: {
                id: stageData.applicationId,
                candidateId: candidateId
            },
            include: {
                interviewStep: true,
                position: {
                    include: {
                        interviewFlow: {
                            include: {
                                interviewSteps: true
                            }
                        }
                    }
                }
            }
        });

        if (!application) {
            throw new Error('Application not found or does not belong to this candidate');
        }

        // Verificar que el nuevo paso de entrevista es válido para esta posición
        const validStep = application.position.interviewFlow?.interviewSteps.find(
            step => step.id === stageData.newInterviewStepId
        );

        if (!validStep) {
            throw new Error('Invalid interview step for this position');
        }

        // Obtener información del paso anterior
        const previousStep = application.interviewStep;

        // Obtener información del nuevo paso
        const newStep = await prisma.interviewStep.findUnique({
            where: { id: stageData.newInterviewStepId }
        });

        if (!newStep) {
            throw new Error('New interview step not found');
        }

        // Actualizar la aplicación
        const applicationModel = new Application(application);
        await applicationModel.updateInterviewStep(stageData.newInterviewStepId, stageData.notes);

        return {
            applicationId: application.id,
            candidateId: candidateId,
            previousStep: {
                id: previousStep.id,
                name: previousStep.name
            },
            currentStep: {
                id: newStep.id,
                name: newStep.name
            },
            updatedAt: new Date().toISOString()
        };

    } catch (error: any) {
        console.error('Error updating candidate stage:', error);
        throw error;
    }
};
