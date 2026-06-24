'use server'
import { db } from '@/lib/db'
import { eq, isNotNull, isNull, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

function getSchema() {
  return process.env.DB_DRIVER === 'postgres'
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export async function getAffiliateTools(statusFilter?: string) {
  const schema = getSchema()
  let query = (db as any).select({
    id: schema.tools.id,
    name: schema.tools.name,
    urlAffiliate: schema.tools.urlAffiliate,
    affiliateRate: schema.tools.affiliateRate,
    hasAffiliate: schema.tools.hasAffiliate,
  }).from(schema.tools)

  if (statusFilter === 'active') {
    query = query.where(and(eq(schema.tools.hasAffiliate, true), isNotNull(schema.tools.affiliateRate)))
  } else if (statusFilter === 'pending') {
    query = query.where(and(eq(schema.tools.hasAffiliate, true), isNull(schema.tools.affiliateRate)))
  } else if (statusFilter === 'none') {
    query = query.where(eq(schema.tools.hasAffiliate, false))
  }

  return query.orderBy(schema.tools.name)
}

export async function updateAffiliateLink(id: string, urlAffiliate: string, affiliateRate: string, hasAffiliate: boolean) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).update(schema.tools)
    .set({ urlAffiliate, affiliateRate, hasAffiliate })
    .where(eq(schema.tools.id, id))
  revalidatePath('/admin/affiliate')
}
