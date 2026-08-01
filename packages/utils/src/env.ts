import * as process from 'node:process';

export const env = (name: string) => {
  const value = process.env[name] || process.env[name.toLowerCase()];

  if (!value) {
    throw new Error(`Env "${name}" not found`);
  }

  return value;
};
