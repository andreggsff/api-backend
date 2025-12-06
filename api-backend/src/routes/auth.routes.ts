// api-backend/src/routes/auth.routes.ts

import { Router, Request, Response } from 'express';
import prisma from '../prisma'; // Importa o Prisma Client
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'; // Pega a chave do .env

// Rota de Login (POST /auth/login)
router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body; // Pega email e senha do corpo da requisição

  // 1. Verificar se o usuário existe no banco
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    // Se o usuário não for encontrado, retorna erro
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  // 2. Comparar a senha fornecida com o hash salvo no banco
  // bcrypt.compare() compara a senha bruta (fornecida) com o hash (do banco)
  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    // Se a senha não bater, retorna erro
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  // 3. Gerar o Token JWT
  // Assinamos o token com o ID do usuário e a chave secreta
  const token = jwt.sign(
    { userId: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '1d' } // Expira em 1 dia
  );

  // 4. Sucesso: Retorna o token para o frontend
  return res.json({ token, nome: usuario.nome });
});

export default router;