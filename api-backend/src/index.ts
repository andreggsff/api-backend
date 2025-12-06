// api-backend/src/index.ts

import express, { Request, Response } from 'express';
import prisma from './prisma'; // ⬅️ Importa o cliente Prisma
import authRoutes from './routes/auth.routes'; // ⬅️ Importa as rotas de Login/Cadastro
import { requireAuth } from './middleware/auth.middleware'; // ⬅️ Importa o Middleware JWT
import cors from 'cors'; // Necessário para permitir o Frontend acessar a API

const app = express();

// Configurações do Servidor
app.use(express.json()); // Habilita o Express a ler JSON no corpo das requisições

// CORS: Permite que o frontend (em um domínio diferente) acesse a API
// 🚨 Nota: Em produção, você deve restringir isso apenas ao domínio do Render do seu frontend!
app.use(cors()); 

const PORT = process.env.PORT || 3000;

// ---------------------------------
// 1. Registro de Rotas Públicas
// ---------------------------------
// Todas as rotas de autenticação (/login, /register) são públicas
app.use('/auth', authRoutes);


// ---------------------------------
// 2. Rota de Saúde/Teste
// ---------------------------------
app.get('/', (req: Request, res: Response) => {
  res.send('API está funcionando! Porta: ' + PORT);
});


// ---------------------------------
// 3. Rotas Privadas (Exigem Autenticação)
// ---------------------------------
// O requireAuth é executado antes de qualquer rota abaixo dele!
app.get('/api/users', requireAuth, async (req: Request, res: Response) => {
  try {
    // Se o middleware liberar, o código aqui será executado
    console.log(`Usuário autenticado: ID ${req.userId}`); 

    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
      },
    });

    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});