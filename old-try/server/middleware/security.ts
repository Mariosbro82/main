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
import type { Request, Response } from 'express';

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

// Helmet configuration
// In development, relax CSP to support Vite HMR and React Refresh preamble (inline module script)
// In production, keep a stricter policy
const isDev = process.env.NODE_ENV !== 'production';

export const helmetConfig = isDev
  ? helmet({
      contentSecurityPolicy: {
        directives: {
          // Keep defaults tight but allow what Vite needs in dev
          defaultSrc: ["'self'"],
          // Allow inline module preamble and eval used by React Refresh/HMR
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          // Allow HMR websocket and XHR/fetch to same-origin and common schemes
          connectSrc: ["'self'", 'ws:', 'wss:', 'http:', 'https:', 'http://localhost:*', 'http://127.0.0.1:*'],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  : helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Tailwind
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for GitHub Pages compatibility
    });

// Rate limiting configuration
export const limiter = rateLimit({
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
});

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
