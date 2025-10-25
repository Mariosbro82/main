import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { logger } from "./utils/logger";
import { corsOptions, helmetConfig, limiter } from "./middleware/security";
import { initializeAuth } from "./middleware/auth";

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));

// Initialize authentication
initializeAuth(app);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global rate limiting
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logData = {
        method: req.method,
        path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      };

      if (res.statusCode >= 400) {
        logger.error('API Error', logData);
      } else {
        logger.http(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
      }

      // Keep backward compatibility with old log
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error with context
    logger.error('Unhandled error', {
      error: message,
      stack: err.stack,
      status,
      method: req.method,
      path: req.path,
      ip: req.ip,
    });

    res.status(status).json({ message });
    log(`Error ${status}: ${message}`);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "localhost",
  }, () => {
    logger.info(`🚀 Server started on port ${port}`, {
      port,
      environment: process.env.NODE_ENV || 'development',
    });
    log(`serving on port ${port}`);
  });
})();
