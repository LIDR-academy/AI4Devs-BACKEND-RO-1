import { Router } from 'express';
import { addCandidate, getCandidateById, getCandidatesByPosition, updateCandidateStage } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // console.log(req.body); //Just in case you want to inspect the request body
    const result = await addCandidate(req.body);
    res.status(201).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unexpected error occurred" });
    }
  }
});

// New endpoint: Get all candidates for a position (Kanban view)
router.get('/positions/:id/candidates', getCandidatesByPosition);

// New endpoint: Update candidate's interview stage
router.put('/:id/stage', updateCandidateStage);


router.get('/:id', getCandidateById);

export default router;
