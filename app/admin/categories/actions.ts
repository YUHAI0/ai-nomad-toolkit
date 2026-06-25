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

export async function getCategories() {
  const schema = getSchema()
  return (db as any).select().from(schema.categories).orderBy(schema.categories.priority)
}

export async function createCategory(data: Record<string, unknown>) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).insert(schema.categories).values({ ...data, createdAt: new Date() })
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).update(schema.categories).set(data).where(eq(schema.categories.id, id))
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function updatePriorities(items: Array<{ id: string; priority: number }>) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await Promise.all(
    items.map(item =>
      (db as any).update(schema.categories)
        .set({ priority: item.priority })
        .where(eq(schema.categories.id, item.id))
    )
  )
  revalidatePath('/admin/categories')
  revalidatePath('/')
}
