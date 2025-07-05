# PROMPT 1

## Mission Overview
Develop two new REST API endpoints to enable manipulation of candidate applications in a Kanban-like interface for position management. The endpoints will allow viewing all candidates for a position and updating candidate stages in the interview process.

## Prerequisites
- Analyze existing codebase and database schema
- Understand current authentication/authorization mechanisms
- Review existing API patterns and conventions
- Identify existing models and relationships

## Task 1: Project Analysis & Setup

### 1.1 Codebase Analysis
- [ ] Clone and examine the existing Git repository
- [ ] Identify the project structure and technology stack
- [ ] Review existing API endpoints and their implementation patterns
- [ ] Analyze database schema and relationships between:
  - Positions table
  - Candidates table
  - Applications table
  - Interviews table (if exists)
  - Any scoring/rating tables

### 1.2 Database Schema Investigation
- [ ] Map the relationships between core entities:
  - Position ↔ Application (one-to-many)
  - Candidate ↔ Application (one-to-many)
  - Application ↔ Interview (one-to-many)
  - Interview ↔ Scores/Ratings
- [ ] Identify the field that stores `current_interview_step` in applications
- [ ] Understand the scoring system structure
- [ ] Document any constraints or business rules

### 1.3 Environment Setup
- [ ] Set up local development environment
- [ ] Install dependencies
- [ ] Configure database connection
- [ ] Run existing tests to ensure setup is correct

## Task 2: GET /positions/:id/candidates Endpoint

### 2.1 Endpoint Planning
- [ ] Define the complete endpoint specification:
  - URL pattern: `GET /positions/:id/candidates`
  - Expected response format
  - Error handling scenarios
  - Authentication requirements
- [ ] Plan the database query strategy for optimal performance
- [ ] Design response schema with required fields:
  - Candidate full name
  - Current interview step
  - Average score

### 2.2 Database Query Implementation
- [ ] Write SQL query or ORM query to fetch:
  - All applications for a given position ID
  - Join with candidates table for full names
  - Join with interviews/scores for average calculation
- [ ] Implement efficient average score calculation:
  - Handle cases where no interviews exist
  - Consider only completed interviews
  - Handle null/missing scores appropriately
- [ ] Optimize query performance with appropriate indexes
- [ ] Add query result caching if applicable

### 2.3 Endpoint Implementation
- [ ] Create the route handler following existing patterns
- [ ] Implement input validation:
  - Validate position ID parameter
  - Check if position exists
  - Handle invalid/non-numeric IDs
- [ ] Add authentication/authorization checks
- [ ] Implement the main logic:
  - Fetch applications for the position
  - Calculate average scores
  - Format response data
- [ ] Add comprehensive error handling:
  - Position not found (404)
  - Invalid parameters (400)
  - Database errors (500)
  - Authentication errors (401/403)

### 2.4 Response Formatting
- [ ] Design JSON response structure:
```json
{
  "position_id": 123,
  "candidates": [
    {
      "candidate_id": 456,
      "full_name": "John Doe",
      "current_interview_step": "technical_interview",
      "average_score": 8.5,
      "application_id": 789
    }
  ]
}
```
- [ ] Handle edge cases:
  - No candidates for position
  - Candidates with no completed interviews
  - Candidates with missing scores

## Task 3: PUT /candidates/:id/stage Endpoint

### 3.1 Endpoint Planning
- [ ] Define the complete endpoint specification:
  - URL pattern: `PUT /candidates/:id/stage`
  - Expected request body format
  - Validation rules for stage transitions
  - Business logic constraints
- [ ] Identify valid interview stages/steps
- [ ] Plan stage transition validation logic

### 3.2 Request Validation
- [ ] Implement input validation:
  - Validate candidate ID parameter
  - Validate request body structure
  - Validate new stage value against allowed stages
  - Check stage transition rules (if any)
- [ ] Add business logic validation:
  - Verify candidate exists
  - Verify candidate has an active application
  - Check permissions for stage updates
  - Validate stage progression rules

### 3.3 Database Update Implementation
- [ ] Create the route handler following existing patterns
- [ ] Implement the update logic:
  - Find the candidate's current application
  - Update the `current_interview_step` field
  - Handle database transaction if needed
  - Log the stage change for audit purposes
- [ ] Add optimistic locking if applicable
- [ ] Handle concurrent update scenarios

### 3.4 Response and Error Handling
- [ ] Design success response:
```json
{
  "success": true,
  "candidate_id": 456,
  "previous_stage": "phone_screening",
  "new_stage": "technical_interview",
  "updated_at": "2025-07-05T10:30:00Z"
}
```
- [ ] Implement comprehensive error handling:
  - Candidate not found (404)
  - Invalid stage value (400)
  - Unauthorized stage transition (422)
  - Database constraint violations (409)
  - Authentication errors (401/403)

## Task 4: Testing & Quality Assurance

### 4.1 Unit Testing
- [ ] Write unit tests for both endpoints:
  - Happy path scenarios
  - Edge cases and error conditions
  - Input validation tests
  - Database interaction mocking
- [ ] Test average score calculation logic
- [ ] Test stage transition validation
- [ ] Achieve minimum 80% code coverage

## Task 5: Documentation & Deployment

### 5.1 API Documentation
- [ ] Create comprehensive API documentation:
  - Endpoint specifications
  - Request/response examples
  - Error code explanations
  - Authentication requirements
- [ ] Update OpenAPI/Swagger documentation if used
- [ ] Add inline code comments for complex logic

### 5.2 Database Documentation
- [ ] Document any new database changes
- [ ] Create migration scripts if schema changes needed
- [ ] Update database documentation


## Acceptance Criteria

### GET /positions/:id/candidates
- ✅ Returns all candidates for a given position
- ✅ Includes candidate full name, current interview step, and average score
- ✅ Handles positions with no candidates gracefully
- ✅ Returns appropriate HTTP status codes
- ✅ Includes proper error handling and validation

### PUT /candidates/:id/stage
- ✅ Successfully updates candidate interview stage
- ✅ Validates stage transitions according to business rules
- ✅ Returns confirmation of the update
- ✅ Handles invalid candidates and stages appropriately
- ✅ Maintains data integrity and consistency
