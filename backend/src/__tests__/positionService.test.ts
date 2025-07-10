import { getCandidatesByPositionId } from '../application/services/positionService';

const mockPrisma = {
  application: {
    findMany: jest.fn()
  }
} as any;

const mockApplications = [
  {
    candidateId: 1,
    candidate: { firstName: 'Juan', lastName: 'Pérez' },
    currentInterviewStep: 2,
    interviews: [
      { score: 8 },
      { score: 9 }
    ]
  },
  {
    candidateId: 2,
    candidate: { firstName: 'Ana', lastName: 'García' },
    currentInterviewStep: 1,
    interviews: []
  }
];

describe('getCandidatesByPositionId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve candidatos con nombre, etapa y puntuación media', async () => {
    mockPrisma.application.findMany.mockResolvedValueOnce(mockApplications);
    const result = await getCandidatesByPositionId(10, mockPrisma);
    expect(result).toEqual([
      {
        candidateId: 1,
        fullName: 'Juan Pérez',
        current_interview_step: 2,
        average_score: 8.5
      },
      {
        candidateId: 2,
        fullName: 'Ana García',
        current_interview_step: 1,
        average_score: null
      }
    ]);
    expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
      where: { positionId: 10 },
      include: { candidate: true, interviews: true }
    });
  });

  it('devuelve array vacío si no hay aplicaciones', async () => {
    mockPrisma.application.findMany.mockResolvedValueOnce([]);
    const result = await getCandidatesByPositionId(99, mockPrisma);
    expect(result).toEqual([]);
  });

  it('lanza error si el ID es inválido', async () => {
    await expect(getCandidatesByPositionId(NaN, mockPrisma)).rejects.toThrow('El ID de la posición es inválido');
    await expect(getCandidatesByPositionId(undefined as any, mockPrisma)).rejects.toThrow('El ID de la posición es inválido');
  });
}); 