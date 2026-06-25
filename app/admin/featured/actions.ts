'use server'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export async function getFeaturedTools() {
  const schema = getSchema()
  return (db as any).select().from(schema.tools)
    .where(eq(schema.tools.featured, true))
    .orderBy(schema.tools.sortOrder)
}

export async function getAllPublishedTools() {
  const schema = getSchema()
  return (db as any).select({ id: schema.tools.id, name: schema.tools.name, categoryId: schema.tools.categoryId })
    .from(schema.tools)
    .where(eq(schema.tools.status, 'published'))
}

export async function toggleFeatured(id: string, featured: boolean) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).update(schema.tools).set({ featured }).where(eq(schema.tools.id, id))
  revalidatePath('/admin/featured')
  revalidatePath('/')
}
