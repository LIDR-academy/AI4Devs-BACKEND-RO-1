import { Router } from 'express';
import { getCandidatesByPositionIdController } from '../presentation/controllers/positionController';

const router = Router();

// Endpoint para obtener candidatos de una posición
router.get('/:id/candidates', getCandidatesByPositionIdController);

export default router; 