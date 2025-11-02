/**
 * Security middleware configuration
 *
 * Includes:
 * - CORS (Cross-Origin Resource Sharing)
 * - Helmet (Security headers)
 * - Rate limiting
 */

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allowed origins
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:5000', // Local backend
      'https://mariosbro82.github.io', // GitHub Pages
    ];

    // Add production backend domain from env
    if (process.env.BACKEND_URL) {
      allowedOrigins.push(process.env.BACKEND_URL);
    }

    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
};

const isProduction = process.env.NODE_ENV === 'production';

const fontSources = ["'self'", 'data:', 'https://fonts.gstatic.com'];

const productionDirectives = {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], // Allow inline styles and Google Fonts
  scriptSrc: ["'self'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  connectSrc: ["'self'"],
  fontSrc: fontSources,
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
};

const developmentDirectives = {
  ...productionDirectives,
  // Vite dev server injects inline scripts, eval, blob URLs, and HMR websocket connections.
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
  connectSrc: ["'self'", 'ws:', 'wss:', 'http:', 'https:'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  imgSrc: ["'self'", 'data:', 'https:'],
  fontSrc: fontSources,
};

// Helmet configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: isProduction ? productionDirectives : developmentDirectives,
  },
  crossOriginEmbedderPolicy: false, // Disable for GitHub Pages compatibility
});

// Rate limiting configuration
export const limiter = isProduction
  ? rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
      legacyHeaders: false, // Disable `X-RateLimit-*` headers
      handler: (req: Request, res: Response) => {
        const rateLimit = (req as any).rateLimit;
        res.status(429).json({
          message: 'Too many requests, please try again later.',
          retryAfter: Math.ceil(rateLimit?.resetTime ? (rateLimit.resetTime.getTime() - Date.now()) / 1000 : 900),
        });
      },
    })
  : (_req: Request, _res: Response, next: NextFunction) => next();

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// API-specific rate limiter
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'API rate limit exceeded, please slow down.',
});
