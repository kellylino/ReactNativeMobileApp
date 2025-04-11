import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/type';

export const tokenExtractor = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log('Middleware running');
  const authorization = req.headers['authorization'];

  //console.log("authorozation: ", authorization);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authorization.split(' ')[1];

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT_SECRET not configured.' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }

    //console.log("decode: ", decoded);

    // Ensure the decoded token contains 'id' and 'username' fields
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      req.user_id = (decoded as jwt.JwtPayload).userId;
      req.username = (decoded as jwt.JwtPayload).username;
      next();
    } else {
      return res.status(401).json({ message: 'Invalid token payload.' });
    }
  });
};
