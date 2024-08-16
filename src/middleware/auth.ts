import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  roles: string[];
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    roles?: string[];
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization');
    if (!header) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const token = header.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Token is missing' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.userId = decoded.userId;
    req.roles = decoded.roles;
    if (!req.roles.includes('user')) {
      return res.status(403).json({ error: 'Forbidden: Access is denied' });
    }
    next();
  } catch (err) {
    const error = err as Error;
    return res.status(401).json({ message: error.message });
  }
};

export default auth;
