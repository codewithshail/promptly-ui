import { relations } from 'drizzle-orm';
import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { usageLogs } from './usage';
import { toolCategories } from './tool-categories';
import { bookmarks } from './bookmarks';


export const tools = pgTable('tools', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  subtitle: text('subtitle'),
  logo: text('logo').notNull(), // URL to tool logo
  screenshots: text('screenshots').array(), // URLs to tool screenshots
  priceInfo: text('price_info'), // Pricing information
  generationType: text('generation_type').notNull(), // Type of generation
  isNew: boolean('is_new').default(true), // For "What's New" section
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const toolsRelations = relations(tools, ({ many }) => ({
  categories: many(toolCategories),
  bookmarks: many(bookmarks),
  usageLogs: many(usageLogs),
}));
