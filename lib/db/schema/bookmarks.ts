import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tools } from './tools';

export const bookmarks = pgTable('bookmarks', {
  userId: text('user_id').notNull().references(() => users.id),
  toolId: text('tool_id').notNull().references(() => tools.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey(t.userId, t.toolId),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [bookmarks.toolId],
    references: [tools.id],
  }),
}));