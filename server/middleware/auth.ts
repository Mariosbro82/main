/**
 * Authentication middleware using Passport.js + JWT
 *
 * Features:
 * - Local strategy for username/password login
 * - JWT strategy for API authentication
 * - Password hashing with bcrypt
 * - Token generation and verification
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { logger } from '../utils/logger';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Local Strategy (username/password)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // TODO: Add getUser method to storage
      // const user = await storage.getUser(username);

      // For now, return not implemented
      logger.warn('Local authentication not fully implemented - user storage needed');
      return done(null, false, { message: 'Authentication not configured' });

      // Future implementation:
      // if (!user) {
      //   return done(null, false, { message: 'Invalid credentials' });
      // }
      //
      // const isValid = await bcrypt.compare(password, user.password);
      // if (!isValid) {
      //   return done(null, false, { message: 'Invalid credentials' });
      // }
      //
      // return done(null, user);
    } catch (error) {
      logger.error('Local strategy error:', error);
      return done(error);
    }
  })
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // TODO: Add getUserById method to storage
        // const user = await storage.getUserById(payload.userId);

        // For now, return payload as user
        logger.debug('JWT authentication successful', { userId: payload.userId });
        return done(null, payload);

        // Future implementation:
        // if (!user) {
        //   return done(null, false);
        // }
        //
        // return done(null, user);
      } catch (error) {
        logger.error('JWT strategy error:', error);
        return done(error, false);
      }
    }
  )
);

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string, username: string): string {
  return jwt.sign(
    {
      userId,
      username,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Authentication middleware - require JWT token
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      logger.error('Authentication error:', err);
      return res.status(500).json({ message: 'Authentication error' });
    }

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: info?.message || 'Invalid or missing token',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
}

/**
 * Optional authentication middleware - attach user if token present
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      logger.error('Optional auth error:', err);
    }

    if (user) {
      req.user = user;
    }

    next();
  })(req, res, next);
}

// Initialize passport
export function initializeAuth(app: any) {
  app.use(passport.initialize());
  logger.info('Passport authentication initialized');
}

export { passport };
