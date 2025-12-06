import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
