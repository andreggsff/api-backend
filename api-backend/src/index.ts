import express, { Request, Response } from 'express';
import prisma from './prisma'; 
import authRoutes from './routes/auth.routes'; 
import { requireAuth } from './middleware/auth.middleware'; 
import cors from 'cors'; 

const app = express();

app.use(express.json()); 

app.use(cors()); 

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API está funcionando! Porta: ' + PORT);
});

app.get('/api/users', requireAuth, async (req: Request, res: Response) => {
  try {
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

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
