import { env } from '@ofo/utils/env';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../generated/sqllite/client.js';

const adapter = new PrismaBetterSqlite3({ url: env('DATABASE_URL') });
const prisma = new PrismaClient({ adapter });

export { prisma };
