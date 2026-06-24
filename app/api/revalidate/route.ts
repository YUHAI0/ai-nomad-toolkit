import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { path, tag } = await req.json()

  if (tag) revalidateTag(tag)
  if (path) revalidatePath(path)

  revalidatePath('/')
  revalidatePath('/category/[slug]', 'page')
  revalidatePath('/tool/[slug]', 'page')

  return NextResponse.json({ revalidated: true })
}
