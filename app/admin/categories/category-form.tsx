'use client'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCategory, updateCategory } from './actions'

interface Props {
  mode: 'create' | 'edit'
  category?: Record<string, any>
}

export function CategoryForm({ mode, category }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const data: Record<string, unknown> = {}
    fd.forEach((v, k) => { data[k] = v })
    data.isAi = fd.get('isAi') === 'true'
    data.priority = Number(fd.get('priority') ?? 0)

    try {
      if (mode === 'create') {
        await createCategory(data)
      } else {
        await updateCategory(category!.id, data)
      }
      setOpen(false)
    } catch {
      setError('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        {mode === 'create'
          ? <Button className="bg-green-600 hover:bg-green-700">+ 新建栏目</Button>
          : <button type="button" className="px-3 py-1 rounded text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">编辑</button>
        }
      </DrawerTrigger>
      <DrawerContent className="w-[420px] h-full overflow-y-auto p-6">
        <DrawerHeader className="px-0">
          <DrawerTitle>{mode === 'create' ? '新建栏目' : `编辑：${category?.name}`}</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>栏目 ID (slug)</Label>
              <Input name="id" defaultValue={category?.id} placeholder="ai-tools" required={mode === 'create'} disabled={mode === 'edit'} />
            </div>
            <div>
              <Label>栏目名称 *</Label>
              <Input name="name" defaultValue={category?.name} placeholder="AI 工具" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>英文名</Label>
              <Input name="nameEn" defaultValue={category?.nameEn} placeholder="AI Tools" />
            </div>
            <div>
              <Label>Emoji</Label>
              <Input name="emoji" defaultValue={category?.emoji} placeholder="⚡" />
            </div>
          </div>
          <div>
            <Label>简介</Label>
            <Input name="description" defaultValue={category?.description} />
          </div>
          <div>
            <Label>目标受众</Label>
            <Input name="audience" defaultValue={category?.audience} placeholder="开发者、自由职业者" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>是否 AI 板块</Label>
              <Select name="isAi" defaultValue={category?.isAi !== false ? 'true' : 'false'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">板块 A (AI)</SelectItem>
                  <SelectItem value="false">板块 B (非AI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>排序权重</Label>
              <Input name="priority" type="number" defaultValue={category?.priority ?? 0} />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 flex-1" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>取消</Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
