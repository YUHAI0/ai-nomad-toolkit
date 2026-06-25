'use client'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createTool, updateTool } from './actions'

const selectClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white'

interface Props {
  categories: Array<{ id: string; name: string; emoji: string | null }>
  tool?: Record<string, any>
  mode: 'create' | 'edit'
}

export function ToolForm({ categories, tool, mode }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const data: Record<string, unknown> = {}
    fd.forEach((v, k) => { data[k] = v })
    data.hasAffiliate = fd.get('hasAffiliate') === 'true'
    data.isAi = fd.get('isAi') === 'true'
    data.featured = fd.get('featured') === 'true'
    data.tags = (fd.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)

    try {
      if (mode === 'create') {
        await createTool(data)
      } else {
        await updateTool(tool!.id, data)
      }
      setOpen(false)
    } catch (err) {
      setError('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right" modal={false} handleOnly>
      <DrawerTrigger asChild>
        {mode === 'create'
          ? <Button className="bg-green-600 hover:bg-green-700">+ 新建工具</Button>
          : <button type="button" className="px-3 py-1 rounded text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">编辑</button>
        }
      </DrawerTrigger>
      <DrawerContent className="w-[520px] h-full overflow-y-auto p-6">
        <DrawerHeader className="px-0">
          <DrawerTitle>{mode === 'create' ? '新建工具' : `编辑：${tool?.name}`}</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>工具 ID (slug)</Label>
              <Input name="id" defaultValue={tool?.id} placeholder="cursor" required={mode === 'create'} disabled={mode === 'edit'} />
            </div>
            <div>
              <Label>工具名称 *</Label>
              <Input name="name" defaultValue={tool?.name} placeholder="Cursor" required />
            </div>
          </div>
          <div>
            <Label>官网 URL *</Label>
            <Input name="urlOfficial" defaultValue={tool?.urlOfficial} placeholder="https://cursor.com" required />
          </div>
          <div>
            <Label>Affiliate URL</Label>
            <Input name="urlAffiliate" defaultValue={tool?.urlAffiliate} placeholder="https://cursor.com/?ref=xxx" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>有 Affiliate</Label>
              <select name="hasAffiliate" defaultValue={tool?.hasAffiliate ? 'true' : 'false'} className={selectClass}>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
            <div>
              <Label>佣金说明</Label>
              <Input name="affiliateRate" defaultValue={tool?.affiliateRate} placeholder="40%循环" />
            </div>
            <div>
              <Label>栏目</Label>
              <select name="categoryId" defaultValue={tool?.categoryId ?? ''} className={selectClass}>
                <option value="">选择栏目</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>定价类型</Label>
              <select name="pricingType" defaultValue={tool?.pricingType ?? ''} className={selectClass}>
                <option value="">选择</option>
                <option value="free">免费</option>
                <option value="freemium">Freemium</option>
                <option value="paid">付费</option>
              </select>
            </div>
            <div>
              <Label>定价说明</Label>
              <Input name="pricingDesc" defaultValue={tool?.pricingDesc} placeholder="Pro $20/月" />
            </div>
          </div>
          <div>
            <Label>一句话描述（中文，30字内）</Label>
            <Input name="oneLiner" defaultValue={tool?.oneLiner} />
          </div>
          <div>
            <Label>标签（逗号分隔，最多5个）</Label>
            <Input name="tags" defaultValue={Array.isArray(tool?.tags) ? tool.tags.join(', ') : ''} placeholder="AI IDE, 编程, Vibe Coding" />
          </div>
          <div>
            <Label>详细介绍（200-500字）</Label>
            <Textarea name="description" defaultValue={tool?.description} rows={6} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>是否 AI 工具</Label>
              <select name="isAi" defaultValue={tool?.isAi !== false ? 'true' : 'false'} className={selectClass}>
                <option value="true">AI 工具</option>
                <option value="false">非 AI</option>
              </select>
            </div>
            <div>
              <Label>地区</Label>
              <select name="region" defaultValue={tool?.region ?? 'global'} className={selectClass}>
                <option value="global">全球</option>
                <option value="cn">中国</option>
                <option value="us-ca">美加</option>
                <option value="asia">亚洲</option>
              </select>
            </div>
            <div>
              <Label>精选工具</Label>
              <select name="featured" defaultValue={tool?.featured ? 'true' : 'false'} className={selectClass}>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input name="logoUrl" defaultValue={tool?.logoUrl} placeholder="/logos/cursor.png 或 https://..." />
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
