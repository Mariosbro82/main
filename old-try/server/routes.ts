import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScenarioSchema, insertPrivatePensionPlanSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { calculatePrivatePension } from "../shared/utils/financial-calculator";
import { generateInteractivePensionForm } from "../shared/services/interactive-pdf-form";
import { logger } from "./utils/logger";
import { cacheMiddleware, getCacheStats } from "./middleware/cache";
import { registerAuthRoutes } from "./routes/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register authentication routes
  registerAuthRoutes(app);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Cache stats endpoint (for monitoring)
  app.get("/api/cache/stats", (req, res) => {
    const stats = getCacheStats();
    res.json(stats);
  });

  // Scenarios endpoints with caching
  app.get("/api/scenarios", cacheMiddleware(300), async (req, res) => {
    try {
      const scenarios = await storage.getScenarios();
      res.json(scenarios);
    } catch (error) {
      logger.error('GET /api/scenarios - Error:', error);
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.id);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenario" });
    }
  });

  app.post("/api/scenarios", async (req, res) => {
    try {
      const validatedData = insertScenarioSchema.parse(req.body);
      const scenario = await storage.createScenario(validatedData);
      res.status(201).json(scenario);
    } catch (error) {
      logger.error('POST /api/scenarios - Error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to create scenario" });
    }
  });

  app.put("/api/scenarios/:id", async (req, res) => {
    try {
      const validatedData = insertScenarioSchema.partial().parse(req.body);
      const scenario = await storage.updateScenario(req.params.id, validatedData);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to update scenario" });
    }
  });

  app.delete("/api/scenarios/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteScenario(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete scenario" });
    }
  });

  // Private Pension Plans endpoints
  app.get("/api/scenarios/:scenarioId/pension-plans", async (req, res) => {
    try {
      const plans = await storage.getPrivatePensionPlansByScenario(req.params.scenarioId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pension plans" });
    }
  });

  app.get("/api/pension-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPrivatePensionPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: "Pension plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pension plan" });
    }
  });

  app.post("/api/pension-plans", async (req, res) => {
    try {
      const validatedData = insertPrivatePensionPlanSchema.parse(req.body);
      const plan = await storage.createPrivatePensionPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to create pension plan" });
    }
  });

  app.put("/api/pension-plans/:id", async (req, res) => {
    try {
      const validatedData = insertPrivatePensionPlanSchema.partial().parse(req.body);
      const plan = await storage.updatePrivatePensionPlan(req.params.id, validatedData);
      if (!plan) {
        return res.status(404).json({ message: "Pension plan not found" });
      }
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to update pension plan" });
    }
  });

  app.delete("/api/pension-plans/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePrivatePensionPlan(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Pension plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete pension plan" });
    }
  });

  // Simulation endpoint - accepts ad-hoc calculations without requiring a persisted scenario
  app.post("/api/simulate", async (req, res) => {
    try {
      // Create a schema that makes scenarioId optional for simulations
      const simulationSchema = insertPrivatePensionPlanSchema.extend({
        scenarioId: z.string().default('temp-simulation'),
      });

      const validatedData = simulationSchema.parse(req.body);
      const simulation = calculatePrivatePension(validatedData);
      res.json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to run simulation" });
    }
  });

  // Dynamic values update endpoint
  app.post("/api/pension-plans/:id/update-values", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        currentAge: z.number().min(18).max(80).optional(),
        monthlyContribution: z.number().min(0).optional(),
        termYears: z.number().min(5).max(45).optional(),
        targetMaturityValue: z.number().min(0).optional(),
        payoutStartAge: z.number().min(62).max(85).optional(),
        payoutEndAge: z.number().min(62).max(85).optional(),
        expectedReturn: z.number().min(0).max(1).optional(),
        monthlyPension: z.number().min(0).optional(),
        totalValue: z.number().min(0).optional()
      });
      
      const validatedData = updateSchema.parse(req.body);
      
      // Get current plan
      const currentPlan = await storage.getPrivatePensionPlan(id);
      if (!currentPlan) {
        return res.status(404).json({ message: "Pension plan not found" });
      }
      
      // Update plan with new values
      const updatedPlan = await storage.updatePrivatePensionPlan(id, validatedData);
      if (!updatedPlan) {
        return res.status(404).json({ message: "Failed to update pension plan" });
      }
      
      // Recalculate simulation with updated values
      const simulation = calculatePrivatePension({
        scenarioId: updatedPlan.scenarioId,
        currentAge: updatedPlan.currentAge,
        startAge: updatedPlan.startAge,
        monthlyContribution: updatedPlan.monthlyContribution,
        startInvestment: updatedPlan.startInvestment,
        termYears: updatedPlan.termYears,
        payoutStartAge: updatedPlan.payoutStartAge,
        payoutEndAge: updatedPlan.payoutEndAge,
        payoutMode: updatedPlan.payoutMode as "annuity" | "flex",
        annuityRate: updatedPlan.annuityRate,
        policyFeeAnnualPct: updatedPlan.policyFeeAnnualPct,
        policyFixedAnnual: updatedPlan.policyFixedAnnual,
        taxRatePayout: updatedPlan.taxRatePayout,
        expectedReturn: updatedPlan.expectedReturn,
        ter: updatedPlan.ter,
        volatility: updatedPlan.volatility,
        rebalancingEnabled: updatedPlan.rebalancingEnabled
      });
      
      res.json({
        plan: updatedPlan,
        simulation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to update values" });
    }
  });

  // Real-time calculation endpoint for instant feedback
  app.post("/api/calculate-instant", async (req, res) => {
    try {
      const validatedData = insertPrivatePensionPlanSchema.partial().parse(req.body);
      
      // Merge with default values for instant calculation
      const defaultPlan = {
        scenarioId: "temp",
        currentAge: 30,
        startAge: 30,
        monthlyContribution: 500,
        startInvestment: 0,
        termYears: 30,
        payoutStartAge: 67,
        payoutEndAge: 85,
        payoutMode: "annuity" as const,
        annuityRate: 0.03,
        policyFeeAnnualPct: 0.004,
        policyFixedAnnual: 0,
        taxRatePayout: 0.17,
        expectedReturn: 0.065,
        ter: 0.008,
        volatility: 0.18,
        rebalancingEnabled: true,
        ...validatedData
      };
      
      const simulation = calculatePrivatePension(defaultPlan);
      res.json(simulation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(500).json({ message: "Failed to calculate instant simulation" });
    }
  });

  // Info box content endpoint
  app.get("/api/info-content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { value, age, term } = req.query;

      const infoContent = {
        age: {
          title: "Alter bei Rentenbeginn",
          content: `Mit ${age} Jahren beginnt Ihre Auszahlungsphase. Je später der Rentenbeginn, desto höher die monatliche Rente.`,
          tips: [
            "Frühester Rentenbeginn: 62 Jahre",
            "Regulärer Rentenbeginn: 67 Jahre",
            "Jedes Jahr später erhöht die Rente um ca. 6-8%"
          ]
        },
        contribution: {
          title: "Monatlicher Beitrag",
          content: `Bei ${value}€ monatlich sparen Sie ${Number(value) * 12}€ pro Jahr. Höhere Beiträge führen zu deutlich höheren Renten.`,
          tips: [
            "Steuervorteile bei Rürup-Rente nutzen",
            "Beiträge können flexibel angepasst werden",
            "Compound-Effekt verstärkt sich bei höheren Beiträgen"
          ]
        },
        term: {
          title: "Laufzeit",
          content: `Bei ${term} Jahren Laufzeit profitieren Sie vom Zinseszinseffekt. Längere Laufzeiten erhöhen das Endkapital überproportional.`,
          tips: [
            "Jedes zusätzliche Jahr bringt deutlich mehr Rendite",
            "Früher Beginn ist wichtiger als hohe Beiträge",
            "Zeit ist der wichtigste Faktor beim Vermögensaufbau"
          ]
        },
        pension: {
          title: "Monatliche Rente",
          content: `Ihre prognostizierte Rente beträgt ${value}€ monatlich. Dies basiert auf aktuellen Berechnungen und kann variieren.`,
          tips: [
            "Inflation nicht vergessen - Kaufkraft sinkt",
            "Zusätzliche Altersvorsorge empfehlenswert",
            "Regelmäßige Überprüfung der Strategie"
          ]
        }
      };

      const content = infoContent[type as keyof typeof infoContent];
      if (!content) {
        return res.status(404).json({ message: "Info content not found" });
      }

      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch info content" });
    }
  });

  // Generate Interactive PDF Form endpoint
  app.get("/api/generate-interactive-form", async (req, res) => {
    try {
      const language = (req.query.language as 'de' | 'en') || 'de';

      // Generate the interactive PDF form
      const pdfBytes = await generateInteractivePensionForm({ language });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="pension-calculator-form-${language}.pdf"`
      );
      res.setHeader('Content-Length', pdfBytes.length);

      // Send the PDF
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      logger.error('Error generating interactive PDF form:', error);
      res.status(500).json({ message: "Failed to generate interactive PDF form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
