import { updateCandidateStage } from '../application/services/candidateService';

const mockPrisma = {
  application: {
    findFirst: jest.fn(),
    update: jest.fn()
  }
} as any;

describe('updateCandidateStage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('actualiza la etapa correctamente', async () => {
    mockPrisma.application.findFirst.mockResolvedValueOnce({ id: 10 });
    mockPrisma.application.update.mockResolvedValueOnce({
      id: 10,
      candidateId: 1,
      currentInterviewStep: 3
    });
    const result = await updateCandidateStage(1, 2, 3, mockPrisma);
    expect(result).toEqual({ id: 10, candidateId: 1, currentInterviewStep: 3 });
    expect(mockPrisma.application.findFirst).toHaveBeenCalledWith({ where: { candidateId: 1, positionId: 2 } });
    expect(mockPrisma.application.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { currentInterviewStep: 3 } });
  });

  it('lanza error si no se encuentra la aplicación', async () => {
    mockPrisma.application.findFirst.mockResolvedValueOnce(null);
    await expect(updateCandidateStage(1, 2, 3, mockPrisma)).rejects.toThrow('No se encontró la aplicación para el candidato y posición especificados');
  });

  it('lanza error si el ID del candidato es inválido', async () => {
    await expect(updateCandidateStage(NaN, 2, 3, mockPrisma)).rejects.toThrow('El ID del candidato es inválido');
  });

  it('lanza error si el ID de la posición es inválido', async () => {
    await expect(updateCandidateStage(1, NaN, 3, mockPrisma)).rejects.toThrow('El ID de la posición es inválido');
  });

  it('lanza error si la nueva etapa es inválida', async () => {
    await expect(updateCandidateStage(1, 2, NaN, mockPrisma)).rejects.toThrow('La nueva etapa es inválida');
  });
}); 