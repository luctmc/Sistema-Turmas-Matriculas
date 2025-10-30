import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/database.js';

export const createToken = (payload) => jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

export const verifyToken = (token) => jwt.verify(token, jwtConfig.secret);
