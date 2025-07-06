import { updateApplicationStage } from '../src/presentation/controllers/candidateController';

describe('updateApplicationStage', () => {
    let req: any;
    let res: any;
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = {
            interviewStep: { findUnique: jest.fn() },
            application: { findFirst: jest.fn(), update: jest.fn() },
        };
        req = {
            params: { id: '1' },
            body: { applicationId: 2, currentInterviewStep: 3 },
            prisma: prismaMock,
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('actualiza exitosamente la etapa cuando la etapa y la aplicación existen', async () => {
        // Mock: la etapa existe
        prismaMock.interviewStep.findUnique.mockResolvedValue({ id: 3 });
        // Mock: la aplicación existe
        prismaMock.application.findFirst.mockResolvedValue({
            id: 2,
            candidateId: 1,
            currentInterviewStep: 1,
        });
        // Mock: actualización exitosa
        prismaMock.application.update.mockResolvedValue({
            id: 2,
            candidateId: 1,
            currentInterviewStep: 3,
            positionId: 5,
        });

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Stage updated successfully',
            application: {
                id: 2,
                candidateId: 1,
                currentInterviewStep: 3,
                positionId: 5,
            },
        });
    });

    it('devuelve 400 si la etapa (currentInterviewStep) no existe', async () => {
        prismaMock.interviewStep.findUnique.mockResolvedValue(null);

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Interview step does not exist' });
    });

    it('devuelve 404 si la aplicación no existe para el candidato', async () => {
        prismaMock.interviewStep.findUnique.mockResolvedValue({ id: 3 });
        prismaMock.application.findFirst.mockResolvedValue(null);

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Application not found for this candidate' });
    });

    it('devuelve 400 si candidateId, applicationId o currentInterviewStep son inválidos', async () => {
        req.params.id = 'abc'; // candidateId inválido

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid candidate id, applicationId o currentInterviewStep' });

        // Prueba con applicationId faltante
        req.params.id = '1';
        req.body.applicationId = undefined;

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        // Prueba con currentInterviewStep faltante
        req.body.applicationId = 2;
        req.body.currentInterviewStep = undefined;

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('devuelve 500 si ocurre un error inesperado', async () => {
        prismaMock.interviewStep.findUnique.mockRejectedValue(new Error('DB error'));

        await updateApplicationStage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
});