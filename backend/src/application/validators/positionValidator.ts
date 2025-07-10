export const validateGetCandidatesRequest = (positionId: number, query: any) => {
    // Validar positionId
    if (!positionId || isNaN(positionId) || positionId <= 0) {
        throw new Error('Invalid position ID: must be a positive number');
    }

    // Validar parámetros de query
    if (query.stage) {
        const stage = parseInt(query.stage);
        if (isNaN(stage) || stage <= 0) {
            throw new Error('Invalid stage: must be a positive number');
        }
    }

    if (query.limit) {
        const limit = parseInt(query.limit);
        if (isNaN(limit) || limit < 1 || limit > 100) {
            throw new Error('Invalid limit: must be between 1 and 100');
        }
    }

    if (query.offset) {
        const offset = parseInt(query.offset);
        if (isNaN(offset) || offset < 0) {
            throw new Error('Invalid offset: must be >= 0');
        }
    }

    return true;
}; 