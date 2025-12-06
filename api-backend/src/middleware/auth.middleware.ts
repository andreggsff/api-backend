// api-backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ----------------------------------------------------
// 1. Tipagem para injetar dados do usuário na Requisição
// Isso evita erros no TypeScript ao acessar req.userId
interface DecodedToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

// Estende a interface Request do Express para incluir os dados do usuário
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
    }
  }
}
// ----------------------------------------------------

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 1. Pegar o cabeçalho de Autorização (Authorization: Bearer TOKEN)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  // 2. Extrair o Token (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar e decodificar o Token
    // Ele usa o JWT_SECRET para garantir que o token foi assinado pelo nosso servidor.
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // 4. Se o token for válido, injetar os dados do usuário na Requisição
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // 5. Liberar: Chamar next() para seguir para a próxima função (a rota principal)
    next();
  } catch (error) {
    // 6. Token inválido (expirado, modificado ou chave incorreta)
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};