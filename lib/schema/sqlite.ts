import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable('categories', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  nameEn:        text('name_en'),
  emoji:         text('emoji'),
  description:   text('description'),
  descriptionEn: text('description_en'),
  audience:      text('audience'),
  isAi:          integer('is_ai', { mode: 'boolean' }).default(true),
  priority:      integer('priority').default(0),
  createdAt:     integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const tools = sqliteTable('tools', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  urlOfficial:   text('url_official').notNull(),
  urlAffiliate:  text('url_affiliate'),
  hasAffiliate:  integer('has_affiliate', { mode: 'boolean' }).default(false),
  affiliateRate: text('affiliate_rate'),
  categoryId:    text('category_id').references(() => categories.id),
  tags:          text('tags', { mode: 'json' }).$type<string[]>().default([]),
  isAi:          integer('is_ai', { mode: 'boolean' }).default(true),
  pricingType:   text('pricing_type').$type<'free' | 'freemium' | 'paid'>(),
  pricingDesc:   text('pricing_desc'),
  oneLiner:      text('one_liner'),
  oneLinerEn:    text('one_liner_en'),
  description:   text('description'),
  descriptionEn: text('description_en'),
  logoUrl:       text('logo_url'),
  featured:      integer('featured', { mode: 'boolean' }).default(false),
  region:        text('region').$type<'global' | 'cn' | 'us-ca' | 'asia'>().default('global'),
  status:        text('status').$type<'draft' | 'published'>().default('draft'),
  sortOrder:     integer('sort_order').default(0),
  lastVerified:  text('last_verified'),
  createdAt:     integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt:     integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
}, (t) => [
  index('idx_tools_category').on(t.categoryId),
  index('idx_tools_status').on(t.status),
  index('idx_tools_featured').on(t.featured),
])

export const adminUsers = sqliteTable('admin_users', {
  id:           text('id').primaryKey(),
  email:        text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type Category = typeof categories.$inferSelect
export type Tool = typeof tools.$inferSelect
export type NewTool = typeof tools.$inferInsert
export type NewCategory = typeof categories.$inferInsert
