/**
 * Authentication routes
 *
 * Endpoints:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login and get JWT token
 * - GET /api/auth/me - Get current user info
 * - POST /api/auth/logout - Logout (client-side token deletion)
 */

import type { Express, Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { generateToken, hashPassword, verifyPassword, requireAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/security';
import { logger } from '../utils/logger';

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
  email: z.string().email().optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function registerAuthRoutes(app: Express) {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  app.post('/api/auth/register', authLimiter, async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);

      // TODO: Implement user storage
      // For now, return not implemented
      logger.warn('User registration attempted but not fully implemented');

      return res.status(501).json({
        message: 'Registration not implemented',
        note: 'User storage needs to be implemented in storage.ts',
      });

      // Future implementation:
      // // Check if user exists
      // const existingUser = await storage.getUserByUsername(validatedData.username);
      // if (existingUser) {
      //   return res.status(409).json({ message: 'Username already exists' });
      // }
      //
      // // Hash password
      // const hashedPassword = await hashPassword(validatedData.password);
      //
      // // Create user
      // const user = await storage.createUser({
      //   username: validatedData.username,
      //   password: hashedPassword,
      //   email: validatedData.email,
      // });
      //
      // // Generate token
      // const token = generateToken(user.id, user.username);
      //
      // logger.info('User registered', { userId: user.id, username: user.username });
      //
      // res.status(201).json({
      //   message: 'User registered successfully',
      //   token,
      //   user: {
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //   },
      // });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  /**
   * POST /api/auth/login
   * Login and receive JWT token
   */
  app.post('/api/auth/login', authLimiter, async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // TODO: Implement user authentication
      // For now, return not implemented
      logger.warn('User login attempted but not fully implemented');

      return res.status(501).json({
        message: 'Login not implemented',
        note: 'User storage and authentication needs to be implemented',
      });

      // Future implementation:
      // // Get user
      // const user = await storage.getUserByUsername(validatedData.username);
      // if (!user) {
      //   return res.status(401).json({ message: 'Invalid credentials' });
      // }
      //
      // // Verify password
      // const isValid = await verifyPassword(validatedData.password, user.password);
      // if (!isValid) {
      //   return res.status(401).json({ message: 'Invalid credentials' });
      // }
      //
      // // Generate token
      // const token = generateToken(user.id, user.username);
      //
      // logger.info('User logged in', { userId: user.id, username: user.username });
      //
      // res.json({
      //   message: 'Login successful',
      //   token,
      //   user: {
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //   },
      // });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  /**
   * GET /api/auth/me
   * Get current authenticated user info
   */
  app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user as any; // TODO: Add proper User type

      if (!user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      res.json({
        user: {
          id: user.userId,
          username: user.username,
        },
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user info' });
    }
  });

  /**
   * POST /api/auth/logout
   * Logout (client-side token deletion)
   */
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    // With JWT, logout is handled client-side by deleting the token
    // This endpoint exists for consistency and can be used for logging
    logger.info('User logged out', { user: req.user });

    res.json({
      message: 'Logged out successfully',
      note: 'Please delete your JWT token on the client side',
    });
  });

  logger.info('Auth routes registered');
}
