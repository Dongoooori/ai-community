import { pgTable, text, timestamp, integer, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('Role', ['USER', 'ADMIN']);

// Tables
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
}, (table) => ({
  providerProviderAccountIdIdx: index('Account_provider_providerAccountId_key').on(table.provider, table.providerAccountId),
}));

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId').notNull(),
  expires: timestamp('expires').notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  identifierTokenIdx: index('VerificationToken_identifier_token_key').on(table.identifier, table.token),
}));

export const newsletters = pgTable('Newsletter', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  thumbnail: text('thumbnail'),
  authorId: text('authorId').notNull(),
  published: boolean('published').default(false).notNull(),
  views: integer('views').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  publishedAt: timestamp('publishedAt'),
}, (table) => ({
  publishedPublishedAtIdx: index('Newsletter_published_publishedAt_idx').on(table.published, table.publishedAt),
  authorIdIdx: index('Newsletter_authorId_idx').on(table.authorId),
}));

export const categories = pgTable('Category', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  order: integer('order').default(0).notNull(),
  userId: text('userId').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('Category_userId_idx').on(table.userId),
}));

export const appItems = pgTable('AppItem', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  url: text('url').notNull(),
  iconUrl: text('iconUrl'),
  order: integer('order').default(0).notNull(),
  categoryId: text('categoryId').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
}, (table) => ({
  categoryIdIdx: index('AppItem_categoryId_idx').on(table.categoryId),
}));

// Relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  newsletters: many(newsletters),
  categories: many(categories),
}));

export const newslettersRelations = relations(newsletters, ({ one }) => ({
  author: one(users, {
    fields: [newsletters.authorId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  items: many(appItems),
}));

export const appItemsRelations = relations(appItems, ({ one }) => ({
  category: one(categories, {
    fields: [appItems.categoryId],
    references: [categories.id],
  }),
}));
