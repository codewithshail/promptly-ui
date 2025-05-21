import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, numeric } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tools } from './tools';

export const usageLogs = pgTable('usage_logs', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  toolId: text('tool_id').notNull().references(() => tools.id),
  quantity: numeric('quantity').notNull(),
  cost: numeric('cost').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [usageLogs.toolId],
    references: [tools.id],
  }),
}));