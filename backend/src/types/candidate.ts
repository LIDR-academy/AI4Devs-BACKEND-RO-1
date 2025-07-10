export interface StageUpdateRequest {
    applicationId: number;
    newInterviewStepId: number;
    notes?: string;
}

export interface StageUpdateResult {
    applicationId: number;
    candidateId: number;
    previousStep: {
        id: number;
        name: string;
    };
    currentStep: {
        id: number;
        name: string;
    };
    updatedAt: string;
}

export interface StageUpdateApiResponse {
    success: boolean;
    data?: StageUpdateResult;
    error?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors?: string[];
}

export interface CandidateStageUpdateParams {
    candidateId: number;
    stageData: StageUpdateRequest;
} 