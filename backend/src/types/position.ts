export interface CandidatePositionData {
    applicationId: number;
    candidateId: number;
    fullName: string;
    email: string;
    currentInterviewStep: {
        id: number;
        name: string;
        orderIndex: number;
        interviewType: string;
    };
    averageScore: number;
    applicationDate: string;
    interviewsCompleted: number;
    totalInterviews: number;
    lastUpdated: string;
}

export interface StageInfo {
    id: number;
    name: string;
    orderIndex: number;
    candidateCount: number;
}

export interface CandidateFilters {
    stage?: number;
    limit?: number;
    offset?: number;
}

export interface PositionCandidatesResponse {
    position: {
        id: number;
        title: string;
        company: string;
    };
    candidates: CandidatePositionData[];
    stages: StageInfo[];
    totalCandidates: number;
}

export interface GetCandidatesApiResponse {
    success: boolean;
    data?: PositionCandidatesResponse;
    error?: string;
} 