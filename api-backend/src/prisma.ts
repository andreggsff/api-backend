// api-backend/src/prisma.ts

import { PrismaClient } from '@prisma/client';

// Cria uma única instância do Prisma Client
// Esta instância se conecta ao banco de dados usando a DATABASE_URL do seu arquivo .env
const prisma = new PrismaClient();

// Exporta a instância para que outros arquivos (como o index.ts e auth.routes.ts)
// possam fazer consultas ao banco de dados.
export default prisma;