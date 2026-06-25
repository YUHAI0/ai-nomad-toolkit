'use server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

function getSchema() {
  return process.env.DATABASE_URL
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export async function createTool(data: Record<string, unknown>) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  const id = (data.id as string) || nanoid(10).toLowerCase().replace(/[^a-z0-9-]/g, '-')
  await (db as any).insert(schema.tools).values({
    ...data,
    id,
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  revalidatePath('/admin/tools')
}

export async function updateTool(id: string, data: Record<string, unknown>) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).update(schema.tools)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.tools.id, id))
  revalidatePath('/admin/tools')
  revalidatePath(`/tool/${id}`)
  revalidatePath(`/site/${id}`)
}

export async function deleteTool(id: string) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).delete(schema.tools).where(eq(schema.tools.id, id))
  revalidatePath('/admin/tools')
}

export async function publishTool(id: string, status: 'published' | 'draft') {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const schema = getSchema()
  await (db as any).update(schema.tools)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.tools.id, id))
  revalidatePath('/admin/tools')
  revalidatePath(`/tool/${id}`)
  revalidatePath(`/site/${id}`)
}

export async function getTools(search?: string, categoryId?: string, status?: string) {
  const schema = getSchema()
  const conditions = []
  const { like, eq, and } = await import('drizzle-orm')

  if (search) conditions.push(like(schema.tools.name, `%${search}%`))
  if (categoryId) conditions.push(eq(schema.tools.categoryId, categoryId))
  if (status) conditions.push(eq(schema.tools.status, status))

  return await (db as any)
    .select()
    .from(schema.tools)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(schema.tools.createdAt)
}

export async function getCategories() {
  const schema = getSchema()
  return await (db as any).select().from(schema.categories).orderBy(schema.categories.priority)
}
