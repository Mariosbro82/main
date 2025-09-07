import { 
  scenarios, 
  privatePensionPlans,
  users,
  type Scenario,
  type InsertScenario,
  type PrivatePensionPlan,
  type InsertPrivatePensionPlan,
  type User, 
  type InsertUser 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scenarios
  getScenarios(): Promise<Scenario[]>;
  getScenario(id: string): Promise<Scenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  updateScenario(id: string, scenario: Partial<InsertScenario>): Promise<Scenario | undefined>;
  deleteScenario(id: string): Promise<boolean>;
  
  // Private Pension Plans
  getPrivatePensionPlansByScenario(scenarioId: string): Promise<PrivatePensionPlan[]>;
  getPrivatePensionPlan(id: string): Promise<PrivatePensionPlan | undefined>;
  createPrivatePensionPlan(plan: InsertPrivatePensionPlan): Promise<PrivatePensionPlan>;
  updatePrivatePensionPlan(id: string, plan: Partial<InsertPrivatePensionPlan>): Promise<PrivatePensionPlan | undefined>;
  deletePrivatePensionPlan(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Scenarios
  async getScenarios(): Promise<Scenario[]> {
    return await db.select().from(scenarios).orderBy(desc(scenarios.createdAt));
  }

  async getScenario(id: string): Promise<Scenario | undefined> {
    const [scenario] = await db.select().from(scenarios).where(eq(scenarios.id, id));
    return scenario || undefined;
  }

  async createScenario(scenario: InsertScenario): Promise<Scenario> {
    const [created] = await db
      .insert(scenarios)
      .values(scenario)
      .returning();
    return created;
  }

  async updateScenario(id: string, scenario: Partial<InsertScenario>): Promise<Scenario | undefined> {
    const [updated] = await db
      .update(scenarios)
      .set({ ...scenario, updatedAt: new Date() })
      .where(eq(scenarios.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteScenario(id: string): Promise<boolean> {
    const result = await db.delete(scenarios).where(eq(scenarios.id, id));
    return (result.changes ?? 0) > 0;
  }

  // Private Pension Plans
  async getPrivatePensionPlansByScenario(scenarioId: string): Promise<PrivatePensionPlan[]> {
    return await db.select().from(privatePensionPlans).where(eq(privatePensionPlans.scenarioId, scenarioId));
  }

  async getPrivatePensionPlan(id: string): Promise<PrivatePensionPlan | undefined> {
    const [plan] = await db.select().from(privatePensionPlans).where(eq(privatePensionPlans.id, id));
    return plan || undefined;
  }

  async createPrivatePensionPlan(plan: InsertPrivatePensionPlan): Promise<PrivatePensionPlan> {
    const [created] = await db
      .insert(privatePensionPlans)
      .values(plan)
      .returning();
    return created;
  }

  async updatePrivatePensionPlan(id: string, plan: Partial<InsertPrivatePensionPlan>): Promise<PrivatePensionPlan | undefined> {
    const [updated] = await db
      .update(privatePensionPlans)
      .set({ ...plan, updatedAt: new Date() })
      .where(eq(privatePensionPlans.id, id))
      .returning();
    return updated || undefined;
  }

  async deletePrivatePensionPlan(id: string): Promise<boolean> {
    const result = await db.delete(privatePensionPlans).where(eq(privatePensionPlans.id, id));
    return (result.changes ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
