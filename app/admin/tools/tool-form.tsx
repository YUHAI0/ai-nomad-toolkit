'use client'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTool, updateTool } from './actions'

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
    <Drawer open={open} onOpenChange={setOpen} direction="right" modal={false}>
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
              <Select name="hasAffiliate" defaultValue={tool?.hasAffiliate ? 'true' : 'false'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">是</SelectItem>
                  <SelectItem value="false">否</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>佣金说明</Label>
              <Input name="affiliateRate" defaultValue={tool?.affiliateRate} placeholder="40%循环" />
            </div>
            <div>
              <Label>栏目</Label>
              <Select name="categoryId" defaultValue={tool?.categoryId}>
                <SelectTrigger><SelectValue placeholder="选择栏目" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>定价类型</Label>
              <Select name="pricingType" defaultValue={tool?.pricingType}>
                <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">免费</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="paid">付费</SelectItem>
                </SelectContent>
              </Select>
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
              <Select name="isAi" defaultValue={tool?.isAi !== false ? 'true' : 'false'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">AI 工具</SelectItem>
                  <SelectItem value="false">非 AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>地区</Label>
              <Select name="region" defaultValue={tool?.region ?? 'global'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">全球</SelectItem>
                  <SelectItem value="cn">中国</SelectItem>
                  <SelectItem value="us-ca">美加</SelectItem>
                  <SelectItem value="asia">亚洲</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>精选工具</Label>
              <Select name="featured" defaultValue={tool?.featured ? 'true' : 'false'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">是</SelectItem>
                  <SelectItem value="false">否</SelectItem>
                </SelectContent>
              </Select>
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
