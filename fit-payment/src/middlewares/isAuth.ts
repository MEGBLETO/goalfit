import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string
}

const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;

    if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'email' in decoded) {
      req.userId = decoded.userId as string;
      req.email = decoded.email as string
    } else {
      return res.status(403).send({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: 'expired token / invalid token' });
  }
};

export default isAuthenticated;
