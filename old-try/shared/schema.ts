import { sql, relations } from "drizzle-orm";
import { pgTable, text, integer, real, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const privatePensionPlans = pgTable("private_pension_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id").notNull().references(() => scenarios.id, { onDelete: "cascade" }),
  
  // Grundlagen
  currentAge: integer("current_age").notNull().default(30),
  startAge: integer("start_age").notNull().default(30),
  
  // Ansparphase
  monthlyContribution: real("monthly_contribution").notNull().default(0),
  startInvestment: real("start_investment").notNull().default(0),
  termYears: integer("term_years").notNull(),
  targetMaturityValue: real("target_maturity_value"),
  
  // Auszahlungsphase
  payoutStartAge: integer("payout_start_age").notNull().default(67),
  payoutEndAge: integer("payout_end_age").notNull().default(85),
  payoutMode: text("payout_mode").notNull().default("annuity"), // "annuity" | "flex"
  annuityRate: real("annuity_rate").notNull().default(0.03),
  safeWithdrawalRate: real("safe_withdrawal_rate"),
  
  // Kosten & Steuern
  policyFeeAnnualPct: real("policy_fee_annual_pct").notNull().default(0.004),
  policyFixedAnnual: real("policy_fixed_annual").notNull().default(0),
  taxRatePayout: real("tax_rate_payout").notNull().default(0.17), // Korrigiert: 17% für Rürup
  
  // Portfolio settings
  expectedReturn: real("expected_return").notNull().default(0.065), // Korrigiert: 6.5% realistischer
  ter: real("ter").notNull().default(0.008), // Korrigiert: 0.8% realistischer TER
  volatility: real("volatility").notNull().default(0.18), // Korrigiert: 18% realistischere Volatilität
  rebalancingEnabled: boolean("rebalancing_enabled").notNull().default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Relations
export const scenariosRelations = relations(scenarios, ({ many }) => ({
  privatePensionPlans: many(privatePensionPlans),
}));

export const privatePensionPlansRelations = relations(privatePensionPlans, ({ one }) => ({
  scenario: one(scenarios, {
    fields: [privatePensionPlans.scenarioId],
    references: [scenarios.id],
  }),
}));

// Schemas
export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPrivatePensionPlanSchema = createInsertSchema(privatePensionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  currentAge: z.number().min(18).max(80),
  startAge: z.number().min(16).max(80),
  termYears: z.number().min(5).max(45),
  payoutStartAge: z.number().min(62).max(85),
  payoutEndAge: z.number().min(62).max(85),
  payoutMode: z.enum(["annuity", "flex"]),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type PrivatePensionPlan = typeof privatePensionPlans.$inferSelect;
export type InsertPrivatePensionPlan = z.infer<typeof insertPrivatePensionPlanSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;