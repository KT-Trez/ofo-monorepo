import { z } from 'zod';

export const getSchemaIssues = (schema: z.ZodType, value: unknown) => {
  const result = schema.safeParse(value);

  return result.success ? [] : result.error.issues.map(issue => issue.message);
};
