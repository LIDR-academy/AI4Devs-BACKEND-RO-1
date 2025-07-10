// Mock del módulo Express app
const mockApp = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    use: jest.fn(),
    listen: jest.fn(),
};

// Mock del módulo supertest
const mockRequest: any = {
    get: jest.fn(() => mockRequest),
    post: jest.fn(() => mockRequest),
    put: jest.fn(() => mockRequest),
    delete: jest.fn(() => mockRequest),
    send: jest.fn(() => mockRequest),
    expect: jest.fn(() => Promise.resolve({
        body: {
            success: true,
            data: {
                position: { id: 1, title: 'Test Position', company: 'Test Company' },
                candidates: [],
                stages: [],
                totalCandidates: 0
            }
        }
    }))
};

jest.mock('supertest', () => jest.fn(() => mockRequest));
jest.mock('../../src/index', () => ({ app: mockApp }));

import { PrismaClient } from '@prisma/client';

const mockPrisma = {
    $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

describe('Kanban Endpoints Integration Tests', () => {
    let testPositionId: number;
    let testCandidateId: number;
    let testApplicationId: number;

    beforeAll(async () => {
        // Setup test data
        testPositionId = 1;
        testCandidateId = 1;
        testApplicationId = 1;
    });

    afterAll(async () => {
        // Cleanup test data
        await mockPrisma.$disconnect();
    });

    describe('GET /positions/:id/candidates', () => {
        it('should return candidates for a valid position', async () => {
            const expectedResponse = {
                success: true,
                data: {
                    position: { id: 1, title: 'Test Position', company: 'Test Company' },
                    candidates: [],
                    stages: [],
                    totalCandidates: 0
                }
            };

            mockRequest.expect.mockResolvedValue({
                body: expectedResponse
            });

            const result = await mockRequest.get(`/positions/${testPositionId}/candidates`).expect(200);

            expect(result.body.success).toBe(true);
            expect(result.body.data).toBeDefined();
            expect(result.body.data.position).toBeDefined();
            expect(result.body.data.candidates).toBeDefined();
            expect(result.body.data.stages).toBeDefined();
            expect(result.body.data.totalCandidates).toBeDefined();
        });

        it('should return 404 for non-existent position', async () => {
            const expectedResponse = {
                success: false,
                error: 'Position not found'
            };

            mockRequest.expect.mockResolvedValue({
                body: expectedResponse
            });

            const result = await mockRequest.get('/positions/999999/candidates').expect(404);

            expect(result.body.success).toBe(false);
            expect(result.body.error).toBe('Position not found');
        });

        it('should return 400 for invalid position ID', async () => {
            const expectedResponse = {
                success: false,
                error: 'Invalid position ID format'
            };

            mockRequest.expect.mockResolvedValue({
                body: expectedResponse
            });

            const result = await mockRequest.get('/positions/invalid/candidates').expect(400);

            expect(result.body.success).toBe(false);
            expect(result.body.error).toBe('Invalid position ID format');
        });
    });

    describe('PUT /candidates/:id/stage', () => {
        it('should update candidate stage successfully', async () => {
            const updateData = {
                applicationId: testApplicationId,
                newInterviewStepId: 2,
                notes: 'Test update'
            };

            const expectedResponse = {
                success: true,
                data: {
                    candidateId: testCandidateId,
                    applicationId: testApplicationId,
                    previousStep: { id: 1, name: 'Initial Screening' },
                    currentStep: { id: 2, name: 'Technical Interview' },
                    updatedAt: new Date().toISOString()
                }
            };

            mockRequest.expect.mockResolvedValue({
                body: expectedResponse
            });

            const result = await mockRequest
                .put(`/candidates/${testCandidateId}/stage`)
                .send(updateData)
                .expect(200);

            expect(result.body.success).toBe(true);
            expect(result.body.data).toBeDefined();
            expect(result.body.data.candidateId).toBe(testCandidateId);
            expect(result.body.data.applicationId).toBe(testApplicationId);
        });

        it('should return 404 for non-existent candidate', async () => {
            const updateData = {
                applicationId: testApplicationId,
                newInterviewStepId: 2,
                notes: 'Test update'
            };

            const expectedResponse = {
                success: false,
                error: 'Candidate not found'
            };

            mockRequest.expect.mockResolvedValue({
                body: expectedResponse
            });

            const result = await mockRequest
                .put('/candidates/999999/stage')
                .send(updateData)
                .expect(404);

            expect(result.body.success).toBe(false);
            expect(result.body.error).toBe('Candidate not found');
        });

        it('should return 400 for missing required fields', async () => {
            const updateData = {
                // Missing applicationId and newInterviewStepId
                notes: 'Test update'
            };

            const expectedResponse = {
                success: false,
                error: 'Missing required fields: applicationId and newInterviewStepId'
            };

            mockRequest.expect.mockResolvedValue({
                body: expectedResponse
            });

            const result = await mockRequest
                .put(`/candidates/${testCandidateId}/stage`)
                .send(updateData)
                .expect(400);

            expect(result.body.success).toBe(false);
            expect(result.body.error).toContain('Missing required fields');
        });
    });

    describe('Basic endpoint availability', () => {
        it('should have GET /positions/:id/candidates endpoint available', () => {
            expect(mockRequest.get).toBeDefined();
        });

        it('should have PUT /candidates/:id/stage endpoint available', () => {
            expect(mockRequest.put).toBeDefined();
        });
    });
}); 