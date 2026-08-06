import { z } from 'zod';

/**
 * 1. Authentication Schemas
 */
export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: 'Full name must be at least 2 characters long' }),
  email: z.string().trim().email({ message: 'Invalid email address format' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  targetJobTitle: z.string().optional()
});

/**
 * 2. Interview Configuration Schemas
 */
export const interviewConfigSchema = z.object({
  mode: z.enum(['HR', 'TECHNICAL'], { message: 'Interview mode must be HR or TECHNICAL' }),
  roleContext: z.string().min(2).optional(),
  cultureProfile: z.enum(['startup', 'enterprise', 'agency']).optional(),
  selectedSkills: z.array(z.string()).min(1, { message: 'Select at least one technology skill' }).optional(),
  difficulty: z.enum(['Junior', 'Mid', 'Senior'], { message: 'Difficulty must be Junior, Mid, or Senior' }).optional(),
  format: z.enum(['conceptual', 'coding', 'design']).optional()
});

/**
 * 3. AI Evaluation Payload Schema
 */
export const aiEvaluationPayloadSchema = z.object({
  candidateProfile: z.object({
    roleTitle: z.string().min(2),
    experienceLevel: z.string().optional(),
    techStack: z.array(z.string()).optional()
  }),
  questionData: z.object({
    questionId: z.string().min(1),
    category: z.string(),
    questionText: z.string().min(5),
    expectedKeywords: z.array(z.string()).optional()
  }),
  responsePayload: z.object({
    candidateAnswer: z.string().min(2, { message: 'Candidate answer cannot be empty' }).max(10000, { message: 'Answer exceeds maximum character limit of 10,000' }),
    timeSpentSeconds: z.number().nonnegative(),
    fillerWordsCount: z.number().nonnegative().optional(),
    pausesCount: z.number().nonnegative().optional()
  })
});

/**
 * Helper to validate arbitrary payloads using Zod schemas
 * @param {z.ZodSchema} schema - Zod Schema
 * @param {any} data - Input payload object
 * @returns {{ success: boolean, data?: any, errors?: object }} Result
 */
export function validatePayload(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const formattedErrors = {};
  const issues = result.error?.issues || result.error?.errors || [];
  issues.forEach(err => {
    const field = err.path.join('.') || 'payload';
    formattedErrors[field] = err.message;
  });

  return { success: false, errors: formattedErrors };
}
