import { pgTable, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  nameEn:        text('name_en'),
  emoji:         text('emoji'),
  description:   text('description'),
  descriptionEn: text('description_en'),
  audience:      text('audience'),
  isAi:          boolean('is_ai').default(true),
  priority:      integer('priority').default(0),
  createdAt:     timestamp('created_at').defaultNow(),
})

export const tools = pgTable('tools', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  urlOfficial:   text('url_official').notNull(),
  urlAffiliate:  text('url_affiliate'),
  hasAffiliate:  boolean('has_affiliate').default(false),
  affiliateRate: text('affiliate_rate'),
  categoryId:    text('category_id').references(() => categories.id),
  tags:          json('tags').$type<string[]>().default([]),
  isAi:          boolean('is_ai').default(true),
  pricingType:   text('pricing_type').$type<'free' | 'freemium' | 'paid'>(),
  pricingDesc:   text('pricing_desc'),
  oneLiner:      text('one_liner'),
  oneLinerEn:    text('one_liner_en'),
  description:   text('description'),
  descriptionEn: text('description_en'),
  logoUrl:       text('logo_url'),
  featured:      boolean('featured').default(false),
  region:        text('region').$type<'global' | 'cn' | 'us-ca' | 'asia'>().default('global'),
  status:        text('status').$type<'draft' | 'published'>().default('draft'),
  sortOrder:     integer('sort_order').default(0),
  lastVerified:  text('last_verified'),
  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id:           text('id').primaryKey(),
  email:        text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    timestamp('created_at').defaultNow(),
})

export type Category = typeof categories.$inferSelect
export type Tool = typeof tools.$inferSelect
export type NewTool = typeof tools.$inferInsert
export type NewCategory = typeof categories.$inferInsert
