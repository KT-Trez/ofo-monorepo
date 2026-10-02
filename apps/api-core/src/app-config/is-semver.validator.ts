import { registerDecorator, type ValidationOptions } from 'class-validator';
import semver from 'semver';

export const IsSemver = (options?: ValidationOptions) => {
  return (target: object, propertyKey: string) => {
    return registerDecorator({
      name: 'isSemver',
      options: { message: '$property must be a valid semver version', ...options },
      propertyName: propertyKey,
      target: target.constructor,
      validator: {
        validate: (value: unknown) => typeof value === 'string' && semver.valid(value) !== null,
      },
    });
  };
};
