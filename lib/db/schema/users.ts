import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';
import { usageLogs } from './usage';
import { bookmarks } from './bookmarks';
import { customRequests } from './custom-requests';

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImage: text("profile_image"),
  reference: varchar("reference", { length: 255 }),
  creditCoins: integer("credit_coins").default(100),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  bookmarks: many(bookmarks),
  usageLogs: many(usageLogs),
  customRequests: many(customRequests),
}));