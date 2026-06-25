'use server'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

function getSchema() {
  return process.env.DB_DRIVER === 'postgres'
    ? require('@/lib/schema/postgres')
    : require('@/lib/schema/sqlite')
}

export async function submitTool(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const urlOfficial = (formData.get('urlOfficial') as string)?.trim()
  const oneLiner = (formData.get('oneLiner') as string)?.trim()
  const categoryId = (formData.get('categoryId') as string)?.trim() || null
  const pricingType = (formData.get('pricingType') as string) || null
  const submitterNote = (formData.get('submitterNote') as string)?.trim()

  if (!name || !urlOfficial) {
    return { success: false, error: '工具名称和官网 URL 为必填项' }
  }

  try {
    const schema = getSchema()
    const id = nanoid(10).toLowerCase().replace(/[^a-z0-9-]/g, '-')
    await (db as any).insert(schema.tools).values({
      id,
      name,
      urlOfficial,
      oneLiner: oneLiner || null,
      categoryId,
      pricingType: pricingType as any,
      description: submitterNote || null,
      status: 'draft',
      isAi: true,
      hasAffiliate: false,
      featured: false,
      region: 'global',
      sortOrder: 0,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (err) {
    console.error('[Submit]', err)
    return { success: false, error: '提交失败，请稍后重试' }
  }
}

export async function getPublicCategories() {
  const schema = getSchema()
  return (db as any)
    .select({ id: schema.categories.id, name: schema.categories.name, emoji: schema.categories.emoji })
    .from(schema.categories)
    .orderBy(schema.categories.priority)
}
