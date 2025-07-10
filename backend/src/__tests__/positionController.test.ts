import request from 'supertest';
import express from 'express';
import { getCandidatesByPositionIdController } from '../presentation/controllers/positionController';
import * as positionService from '../application/services/positionService';

describe('getCandidatesByPositionIdController', () => {
  const app = express();
  app.use(express.json());
  app.get('/positions/:id/candidates', getCandidatesByPositionIdController);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('devuelve 200 y la lista de candidatos', async () => {
    const mockData = [
      { candidateId: 1, fullName: 'Juan Pérez', current_interview_step: 2, average_score: 8.5 }
    ];
    jest.spyOn(positionService, 'getCandidatesByPositionId').mockResolvedValueOnce(mockData);
    const res = await request(app).get('/positions/10/candidates');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('devuelve 400 si el ID es inválido', async () => {
    const res = await request(app).get('/positions/abc/candidates');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El ID de la posición es inválido' });
  });

  it('devuelve 500 si el servicio lanza error', async () => {
    jest.spyOn(positionService, 'getCandidatesByPositionId').mockRejectedValueOnce(new Error('Error de base de datos'));
    const res = await request(app).get('/positions/10/candidates');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Error de base de datos' });
  });
}); 