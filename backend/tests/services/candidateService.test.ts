import { PrismaClient } from '@prisma/client';

// Crear mock simplificado de PrismaClient
const mockPrisma = {
    application: {
        findFirst: jest.fn(),
        update: jest.fn(),
    },
    interviewStep: {
        findUnique: jest.fn(),
    },
};

// Mock del módulo PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

// Mock del modelo Candidate
const mockCandidate = {
    findOne: jest.fn(),
    updateInterviewStep: jest.fn(),
};

jest.mock('../../src/domain/models/Candidate', () => ({
    Candidate: mockCandidate,
}));

// Mock del modelo Application
const mockApplication = {
    updateInterviewStep: jest.fn(),
};

jest.mock('../../src/domain/models/Application', () => ({
    Application: jest.fn().mockImplementation(() => mockApplication),
}));

// Importar después del mock
import { updateCandidateStage } from '../../src/application/services/candidateService';

describe('CandidateService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('updateCandidateStage', () => {
        it('should update stage successfully', async () => {
            // Mock candidate
            const mockCandidateData = { id: 1, firstName: 'Juan', lastName: 'Pérez' };
            mockCandidate.findOne.mockResolvedValue(mockCandidateData);

            // Mock application
            const mockApplicationData = {
                id: 1,
                candidateId: 1,
                positionId: 1,
                interviewStep: {
                    id: 1,
                    name: 'Initial Screening'
                },
                position: {
                    interviewFlow: {
                        interviewSteps: [
                            { id: 1, name: 'Initial Screening' },
                            { id: 2, name: 'Technical Interview' }
                        ]
                    }
                }
            };
            mockPrisma.application.findFirst.mockResolvedValue(mockApplicationData);

            // Mock new interview step
            const mockNewStep = {
                id: 2,
                name: 'Technical Interview'
            };
            mockPrisma.interviewStep.findUnique.mockResolvedValue(mockNewStep);

            const stageData = {
                applicationId: 1,
                newInterviewStepId: 2,
                notes: 'Test notes'
            };

            const result = await updateCandidateStage(1, stageData);

            expect(result).toBeDefined();
            expect(result.candidateId).toBe(1);
            expect(result.applicationId).toBe(1);
            expect(result.previousStep.id).toBe(1);
            expect(result.currentStep.id).toBe(2);
            expect(result.updatedAt).toBeDefined();
        });

        it('should throw error for candidate not found', async () => {
            mockCandidate.findOne.mockResolvedValue(null);

            const stageData = {
                applicationId: 1,
                newInterviewStepId: 2,
                notes: 'Test notes'
            };

            await expect(updateCandidateStage(999, stageData)).rejects.toThrow('Candidate not found');
        });

        it('should throw error for application not belonging to candidate', async () => {
            const mockCandidateData = { id: 1, firstName: 'Juan', lastName: 'Pérez' };
            mockCandidate.findOne.mockResolvedValue(mockCandidateData);
            mockPrisma.application.findFirst.mockResolvedValue(null);

            const stageData = {
                applicationId: 999,
                newInterviewStepId: 2,
                notes: 'Test notes'
            };

            await expect(updateCandidateStage(1, stageData)).rejects.toThrow('Application not found or does not belong to this candidate');
        });

        it('should throw error for invalid interview step', async () => {
            const mockCandidateData = { id: 1, firstName: 'Juan', lastName: 'Pérez' };
            mockCandidate.findOne.mockResolvedValue(mockCandidateData);

            const mockApplicationData = {
                id: 1,
                candidateId: 1,
                positionId: 1,
                interviewStep: {
                    id: 1,
                    name: 'Initial Screening'
                },
                position: {
                    interviewFlow: {
                        interviewSteps: [
                            { id: 1, name: 'Initial Screening' },
                            { id: 2, name: 'Technical Interview' }
                        ]
                    }
                }
            };
            mockPrisma.application.findFirst.mockResolvedValue(mockApplicationData);

            const stageData = {
                applicationId: 1,
                newInterviewStepId: 999, // Invalid step ID
                notes: 'Test notes'
            };

            await expect(updateCandidateStage(1, stageData)).rejects.toThrow('Invalid interview step for this position');
        });

        it('should throw error for new interview step not found', async () => {
            const mockCandidateData = { id: 1, firstName: 'Juan', lastName: 'Pérez' };
            mockCandidate.findOne.mockResolvedValue(mockCandidateData);

            const mockApplicationData = {
                id: 1,
                candidateId: 1,
                positionId: 1,
                interviewStep: {
                    id: 1,
                    name: 'Initial Screening'
                },
                position: {
                    interviewFlow: {
                        interviewSteps: [
                            { id: 1, name: 'Initial Screening' },
                            { id: 2, name: 'Technical Interview' }
                        ]
                    }
                }
            };
            mockPrisma.application.findFirst.mockResolvedValue(mockApplicationData);
            mockPrisma.interviewStep.findUnique.mockResolvedValue(null);

            const stageData = {
                applicationId: 1,
                newInterviewStepId: 2,
                notes: 'Test notes'
            };

            await expect(updateCandidateStage(1, stageData)).rejects.toThrow('New interview step not found');
        });
    });
}); 