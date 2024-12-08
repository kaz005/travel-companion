import { pgTable, text, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const scenes = pgTable("scenes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  explanations: jsonb("explanations").$type<{
    ja: string;
    en: string;
    zh: string;
  }>().notNull(),
});

export const insertSceneSchema = createInsertSchema(scenes);
export const selectSceneSchema = createSelectSchema(scenes);
export type InsertScene = z.infer<typeof insertSceneSchema>;
export type Scene = z.infer<typeof selectSceneSchema>;

// Keep existing user schema
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
