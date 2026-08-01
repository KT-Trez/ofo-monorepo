import { PrismaClient } from '@prisma/client/extension';
import { reactiveHooksExtension } from '@prisma/react-native';

const client = new PrismaClient();
const prisma = client.$extends(reactiveHooksExtension());

export { prisma };
