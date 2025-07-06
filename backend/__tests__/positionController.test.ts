import { getCandidatesByPosition } from '../src/presentation/controllers/positionController';

describe('getCandidatesByPosition', () => {
    let req: any;
    let res: any;
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = {
            application: { findMany: jest.fn() },
            interview: { findMany: jest.fn() },
        };
        req = {
            params: { id: '1' },
            prisma: prismaMock,
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('devuelve correctamente el array con los datos esperados cuando existen aplicaciones y entrevistas con score', async () => {
        // Mock de aplicaciones
        prismaMock.application.findMany.mockResolvedValue([
            {
                id: 1,
                candidateId: 10,
                currentInterviewStep: 3,
                candidate: { id: 10, firstName: 'Juan', lastName: 'Pérez' },
            },
            {
                id: 2,
                candidateId: 11,
                currentInterviewStep: 2,
                candidate: { id: 11, firstName: 'Ana', lastName: 'García' },
            },
        ]);

        // Mock de entrevistas
        prismaMock.interview.findMany.mockResolvedValue([
            { application: { candidateId: 10 }, score: 8 },
            { application: { candidateId: 10 }, score: 7 },
            { application: { candidateId: 11 }, score: 6 },
            { application: { candidateId: 11 }, score: 8 },
        ]);

        await getCandidatesByPosition(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                applicationId: 1,
                fullName: 'Juan Pérez',
                currentInterviewStep: 3,
                averageScore: 7.5,
            },
            {
                applicationId: 2,
                fullName: 'Ana García',
                currentInterviewStep: 2,
                averageScore: 7,
            },
        ]);
    });

    it('devuelve 404 y el mensaje correspondiente cuando no existen aplicaciones para la posición', async () => {
        prismaMock.application.findMany.mockResolvedValue([]);

        await getCandidatesByPosition(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No applications found for this position' });
    });

    it('devuelve 400 y el mensaje correspondiente cuando el id de la posición no es numérico', async () => {
        req.params.id = 'abc'; // id inválido

        await getCandidatesByPosition(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid position id' });
    });

    it('devuelve averageScore como null cuando el candidato no tiene entrevistas con score', async () => {
        prismaMock.application.findMany.mockResolvedValue([
            {
                id: 1,
                candidateId: 10,
                currentInterviewStep: 3,
                candidate: { id: 10, firstName: 'Juan', lastName: 'Pérez' },
            },
        ]);

        // No hay entrevistas con score para el candidato
        prismaMock.interview.findMany.mockResolvedValue([]);

        await getCandidatesByPosition(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                applicationId: 1,
                fullName: 'Juan Pérez',
                currentInterviewStep: 3,
                averageScore: null,
            },
        ]);
    });
    
});