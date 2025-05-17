import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { toolCategories } from './tool-categories';

export const categories = pgTable('categories', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'), // URL to category icon
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  toolCategories: many(toolCategories),
}));