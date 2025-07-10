import request from 'supertest';
import express from 'express';
import { updateCandidateStageController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

describe('updateCandidateStageController', () => {
  const app = express();
  app.use(express.json());
  app.put('/candidates/:id/stage', updateCandidateStageController);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('devuelve 200 y la aplicación actualizada', async () => {
    const mockResult = {
      id: 10,
      positionId: 2,
      candidateId: 1,
      applicationDate: new Date(),
      currentInterviewStep: 3,
      notes: null
    };
    jest.spyOn(candidateService, 'updateCandidateStage').mockResolvedValueOnce(mockResult);
    const res = await request(app)
      .put('/candidates/1/stage')
      .send({ positionId: 2, new_stage: 3 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Etapa actualizada correctamente',
      applicationId: 10,
      candidateId: 1,
      current_interview_step: 3
    });
  });

  it('devuelve 400 si el ID del candidato es inválido', async () => {
    const res = await request(app)
      .put('/candidates/abc/stage')
      .send({ positionId: 2, new_stage: 3 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El ID del candidato es inválido' });
  });

  it('devuelve 400 si el ID de la posición es inválido', async () => {
    const res = await request(app)
      .put('/candidates/1/stage')
      .send({ positionId: 'abc', new_stage: 3 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El ID de la posición es inválido' });
  });

  it('devuelve 400 si la nueva etapa es inválida', async () => {
    const res = await request(app)
      .put('/candidates/1/stage')
      .send({ positionId: 2, new_stage: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'La nueva etapa es inválida' });
  });

  it('devuelve 400 si el servicio lanza error', async () => {
    jest.spyOn(candidateService, 'updateCandidateStage').mockRejectedValueOnce(new Error('No se encontró la aplicación para el candidato y posición especificados'));
    const res = await request(app)
      .put('/candidates/1/stage')
      .send({ positionId: 2, new_stage: 3 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'No se encontró la aplicación para el candidato y posición especificados' });
  });
}); 