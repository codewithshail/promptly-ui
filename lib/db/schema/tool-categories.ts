import { relations } from 'drizzle-orm';
import { pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { tools } from './tools';
import { categories } from './categories';

// Junction table for many-to-many relationship between tools and categories
export const toolCategories = pgTable('tool_categories', {
  toolId: text('tool_id').notNull().references(() => tools.id),
  categoryId: text('category_id').notNull().references(() => categories.id),
}, (t) => ({
  pk: primaryKey(t.toolId, t.categoryId),
}));

export const toolCategoriesRelations = relations(toolCategories, ({ one }) => ({
  tool: one(tools, {
    fields: [toolCategories.toolId],
    references: [tools.id],
  }),
  category: one(categories, {
    fields: [toolCategories.categoryId],
    references: [categories.id],
  }),
}));