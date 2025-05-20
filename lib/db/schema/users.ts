import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { usageLogs } from './usage';
import { bookmarks } from './bookmarks';
import { customRequests } from './custom-requests';

export const users = pgTable('users', {
  id: text('id').primaryKey(), 
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  username: text('username').notNull().unique(),
  profileImage: text('profile_image'), // URL to profile image
  reference: text('reference').notNull(), // User's selected reference category
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(bookmarks),
  usageLogs: many(usageLogs),
  customRequests: many(customRequests),
}));