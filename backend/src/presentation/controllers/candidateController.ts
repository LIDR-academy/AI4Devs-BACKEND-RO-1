import { Request, Response } from 'express';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateApplicationStage = async (req: Request, res: Response) => {
  const prisma = req.prisma;
  const candidateId = parseInt(req.params.id);
  const { applicationId, currentInterviewStep } = req.body;

  if (isNaN(candidateId) || !applicationId || !currentInterviewStep) {
    return res.status(400).json({ message: 'Invalid candidate id, applicationId o currentInterviewStep' });
  }

  try {
    // Validar que la etapa exista
    const step = await prisma.interviewStep.findUnique({
      where: { id: currentInterviewStep },
    });
    if (!step) {
      return res.status(400).json({ message: 'Interview step does not exist' });
    }

    // Buscar la aplicación del candidato
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        candidateId: candidateId,
      },
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found for this candidate' });
    }

    // Actualizar la etapa
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { currentInterviewStep },
    });

    return res.status(200).json({
      message: 'Stage updated successfully',
      application: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { addCandidate };