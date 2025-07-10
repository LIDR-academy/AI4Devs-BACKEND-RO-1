import { PrismaClient } from '@prisma/client';

// Crear mock simplificado de PrismaClient
const mockPrisma = {
    position: {
        findUnique: jest.fn(),
    },
    application: {
        findMany: jest.fn(),
        count: jest.fn(),
    },
    interview: {
        count: jest.fn(),
    },
};

// Mock del módulo PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

// Importar después del mock
import { getCandidatesByPosition } from '../../src/application/services/positionService';

describe('PositionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCandidatesByPosition', () => {
        it('should return candidates for valid position', async () => {
            // Mock position data
            const mockPosition = {
                id: 1,
                title: 'Software Engineer',
                company: { name: 'LTI' },
                interviewFlow: {
                    interviewSteps: [
                        { id: 1, name: 'Initial Screening', orderIndex: 1, interviewType: { name: 'Phone' } },
                        { id: 2, name: 'Technical Interview', orderIndex: 2, interviewType: { name: 'Technical' } }
                    ]
                }
            };

            // Mock applications data
            const mockApplications = [
                {
                    id: 1,
                    candidateId: 1,
                    applicationDate: new Date('2024-01-15'),
                    candidate: {
                        firstName: 'Juan',
                        lastName: 'Pérez',
                        email: 'juan.perez@email.com'
                    },
                    interviewStep: {
                        id: 1,
                        name: 'Initial Screening',
                        orderIndex: 1,
                        interviewType: { name: 'Phone' }
                    },
                    interviews: [
                        { score: 8 },
                        { score: 9 }
                    ]
                }
            ];

            // Setup mocks
            mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
            mockPrisma.application.findMany.mockResolvedValue(mockApplications);
            mockPrisma.application.count.mockResolvedValue(1);
            mockPrisma.interview.count.mockResolvedValue(2);

            const result = await getCandidatesByPosition(1);

            expect(result).toBeDefined();
            expect(result.position.id).toBe(1);
            expect(result.position.title).toBe('Software Engineer');
            expect(result.candidates).toHaveLength(1);
            expect(result.candidates[0].fullName).toBe('Juan Pérez');
            expect(result.candidates[0].averageScore).toBe(8.5);
            expect(result.totalCandidates).toBe(1);
        });

        it('should handle empty candidate list', async () => {
            const mockPosition = {
                id: 1,
                title: 'Software Engineer',
                company: { name: 'LTI' },
                interviewFlow: {
                    interviewSteps: []
                }
            };

            mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
            mockPrisma.application.findMany.mockResolvedValue([]);
            mockPrisma.application.count.mockResolvedValue(0);

            const result = await getCandidatesByPosition(1);

            expect(result.candidates).toHaveLength(0);
            expect(result.totalCandidates).toBe(0);
        });

        it('should throw error for invalid position', async () => {
            mockPrisma.position.findUnique.mockResolvedValue(null);

            await expect(getCandidatesByPosition(999)).rejects.toThrow('Position not found');
        });

        it('should filter by stage correctly', async () => {
            const mockPosition = {
                id: 1,
                title: 'Software Engineer',
                company: { name: 'LTI' },
                interviewFlow: {
                    interviewSteps: [
                        { id: 1, name: 'Initial Screening', orderIndex: 1, interviewType: { name: 'Phone' } }
                    ]
                }
            };

            mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
            mockPrisma.application.findMany.mockResolvedValue([]);
            mockPrisma.application.count.mockResolvedValue(0);

            await getCandidatesByPosition(1, { stage: 1 });

            expect(mockPrisma.application.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        positionId: 1,
                        currentInterviewStep: 1
                    })
                })
            );
        });

        it('should handle pagination', async () => {
            const mockPosition = {
                id: 1,
                title: 'Software Engineer',
                company: { name: 'LTI' },
                interviewFlow: {
                    interviewSteps: []
                }
            };

            mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
            mockPrisma.application.findMany.mockResolvedValue([]);
            mockPrisma.application.count.mockResolvedValue(0);

            await getCandidatesByPosition(1, { limit: 10, offset: 5 });

            expect(mockPrisma.application.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    skip: 5,
                    take: 10
                })
            );
        });
    });
}); 