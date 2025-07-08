import { getPositionCandidates } from '../positionService';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    position: {
      findUnique: jest.fn(),
    },
    application: {
      findMany: jest.fn(),
    },
  })),
}));

describe('PositionService', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPositionCandidates', () => {
    it('should return position candidates when position exists', async () => {
      // Mock data
      const mockPosition = {
        id: 1,
        title: 'Software Engineer'
      };

      const mockApplications = [
        {
          candidate: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          interviewStep: {
            id: 1,
            name: 'Initial Screening',
            orderIndex: 1
          },
          interviews: [
            { score: 4 },
            { score: 5 }
          ],
          applicationDate: new Date('2024-01-15')
        }
      ];

      // Setup mocks
      mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
      mockPrisma.application.findMany.mockResolvedValue(mockApplications);

      // Execute
      const result = await getPositionCandidates(1);

      // Assert
      expect(result).toEqual({
        positionId: 1,
        positionTitle: 'Software Engineer',
        candidates: [
          {
            candidateId: 1,
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            currentInterviewStep: {
              id: 1,
              name: 'Initial Screening',
              orderIndex: 1
            },
            averageScore: 4.5,
            totalInterviews: 2,
            applicationDate: new Date('2024-01-15')
          }
        ]
      });
    });

    it('should throw error when position does not exist', async () => {
      // Setup mocks
      mockPrisma.position.findUnique.mockResolvedValue(null);

      // Execute and assert
      await expect(getPositionCandidates(999)).rejects.toThrow('Position not found');
    });

    it('should return empty candidates array when position has no applications', async () => {
      // Mock data
      const mockPosition = {
        id: 1,
        title: 'Software Engineer'
      };

      // Setup mocks
      mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
      mockPrisma.application.findMany.mockResolvedValue([]);

      // Execute
      const result = await getPositionCandidates(1);

      // Assert
      expect(result).toEqual({
        positionId: 1,
        positionTitle: 'Software Engineer',
        candidates: []
      });
    });

    it('should calculate average score correctly when no interviews', async () => {
      // Mock data
      const mockPosition = {
        id: 1,
        title: 'Software Engineer'
      };

      const mockApplications = [
        {
          candidate: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          interviewStep: {
            id: 1,
            name: 'Initial Screening',
            orderIndex: 1
          },
          interviews: [],
          applicationDate: new Date('2024-01-15')
        }
      ];

      // Setup mocks
      mockPrisma.position.findUnique.mockResolvedValue(mockPosition);
      mockPrisma.application.findMany.mockResolvedValue(mockApplications);

      // Execute
      const result = await getPositionCandidates(1);

      // Assert
      expect(result.candidates[0].averageScore).toBe(0);
      expect(result.candidates[0].totalInterviews).toBe(0);
    });
  });
}); 