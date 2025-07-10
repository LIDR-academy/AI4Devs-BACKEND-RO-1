import { PrismaClient } from '@prisma/client';
import { Interview } from './Interview';

const prisma = new PrismaClient();

export class Application {
    id?: number;
    positionId: number;
    candidateId: number;
    applicationDate: Date;
    currentInterviewStep: number;
    notes?: string;
    interviews: Interview[]; // Added this line

    constructor(data: any) {
        this.id = data.id;
        this.positionId = data.positionId;
        this.candidateId = data.candidateId;
        this.applicationDate = new Date(data.applicationDate);
        this.currentInterviewStep = data.currentInterviewStep;
        this.notes = data.notes;
        this.interviews = data.interviews || []; // Added this line
    }

    async save() {
        const applicationData: any = {
            positionId: this.positionId,
            candidateId: this.candidateId,
            applicationDate: this.applicationDate,
            currentInterviewStep: this.currentInterviewStep,
            notes: this.notes,
        };

        if (this.id) {
            return await prisma.application.update({
                where: { id: this.id },
                data: applicationData,
            });
        } else {
            return await prisma.application.create({
                data: applicationData,
            });
        }
    }

    async getAverageScore(): Promise<number> {
        const interviews = await prisma.interview.findMany({
            where: { 
                applicationId: this.id,
                score: { not: null }
            },
            select: { score: true }
        });

        if (interviews.length === 0) return 0;

        const totalScore = interviews.reduce((sum, interview) => sum + (interview.score || 0), 0);
        return Number((totalScore / interviews.length).toFixed(1));
    }

    async updateInterviewStep(newStepId: number, notes?: string): Promise<void> {
        const updateData: any = {
            currentInterviewStep: newStepId,
        };

        if (notes) {
            updateData.notes = notes;
        }

        await prisma.application.update({
            where: { id: this.id },
            data: updateData,
        });

        this.currentInterviewStep = newStepId;
        if (notes) this.notes = notes;
    }

    static async findOne(id: number): Promise<Application | null> {
        const data = await prisma.application.findUnique({
            where: { id: id },
        });
        if (!data) return null;
        return new Application(data);
    }

    static async findByPositionId(positionId: number): Promise<Application[]> {
        const applications = await prisma.application.findMany({
            where: { positionId: positionId },
            include: {
                candidate: true,
                interviewStep: {
                    include: {
                        interviewType: true
                    }
                },
                interviews: {
                    where: { score: { not: null } },
                    select: { score: true }
                }
            }
        });

        return applications.map(app => new Application(app));
    }
}
