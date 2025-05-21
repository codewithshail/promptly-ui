import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customRequests = pgTable('custom_requests', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  requestDetails: text('request_details').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customRequestsRelations = relations(customRequests, ({ one }) => ({
  user: one(users, {
    fields: [customRequests.userId],
    references: [users.id],
  }),
}));