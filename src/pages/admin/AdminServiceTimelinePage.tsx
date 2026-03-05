import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../config'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Loader2, ArrowLeft, Plus, Pencil, Trash2, ListOrdered } from 'lucide-react'
import type { TimelineItem } from '../../components/ui/modern-timeline'

interface ServiceOption {
  id: number
  title: string
  category: string
}

export const AdminServiceTimelinePage: React.FC = () => {
  const { user, token, isLoading } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState<ServiceOption[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    image: '',
    status: 'upcoming' as 'completed' | 'current' | 'upcoming',
    category: '',
    sort_order: 0,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    const fetchServices = async () => {
      try {
        const res = await fetch(getApiUrl('/api/launchpad/services'))
        if (res.ok) {
          const data = await res.json()
          setServices(data.map((s: { id: number; title: string; category: string }) => ({ id: s.id, title: s.title, category: s.category })))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
  }, [user, navigate])

  useEffect(() => {
    if (!selectedServiceId || !token) return
    setLoadingItems(true)
    const fetchItems = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/admin/services/${selectedServiceId}/timeline`), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingItems(false)
      }
    }
    fetchItems()
  }, [selectedServiceId, token])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      date: '',
      image: '',
      status: 'upcoming',
      category: '',
      sort_order: items.length,
    })
    setEditingId(null)
    setAdding(false)
  }

  const handleAdd = () => {
    resetForm()
    setAdding(true)
  }

  const handleEdit = (item: TimelineItem & { id?: number }) => {
    setForm({
      title: item.title,
      description: item.description,
      date: item.date ?? '',
      image: item.image ?? '',
      status: (item.status as 'completed' | 'current' | 'upcoming') ?? 'upcoming',
      category: item.category ?? '',
      sort_order: (item as { sort_order?: number }).sort_order ?? 0,
    })
    setEditingId(item.id ?? null)
    setAdding(false)
  }

  const handleSave = async () => {
    if (!token || !selectedServiceId) return
    if (!form.title.trim() || !form.description.trim()) return
    setSaving(true)
    try {
      if (editingId !== null) {
        const res = await fetch(getApiUrl(`/api/admin/timeline/${editingId}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const listRes = await fetch(getApiUrl(`/api/admin/services/${selectedServiceId}/timeline`), {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (listRes.ok) setItems(await listRes.json())
          resetForm()
        }
      } else {
        const res = await fetch(getApiUrl(`/api/admin/services/${selectedServiceId}/timeline`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const listRes = await fetch(getApiUrl(`/api/admin/services/${selectedServiceId}/timeline`), {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (listRes.ok) setItems(await listRes.json())
          resetForm()
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (itemId: number) => {
    if (!token || !confirm('Delete this timeline item?')) return
    try {
      const res = await fetch(getApiUrl(`/api/admin/timeline/${itemId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setItems((prev) => prev.filter((i) => (i as { id?: number }).id !== itemId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }
  if (user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <ListOrdered className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Service timeline</h1>
            <p className="text-gray-600">Manage “How we do it” timeline for each launchpad service.</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select service</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingServices ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.title} ({s.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {!selectedServiceId ? (
          <p className="text-gray-500">Select a service to manage its timeline.</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Timeline items</h2>
              <Button onClick={handleAdd} disabled={adding}>
                <Plus className="h-4 w-4 mr-2" />
                Add item
              </Button>
            </div>

            {(adding || editingId !== null) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingId !== null ? 'Edit item' : 'New item'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Discovery call"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Short description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                        placeholder="e.g. 2024-01-15"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        placeholder="e.g. Foundation"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v: 'completed' | 'current' | 'upcoming') =>
                          setForm((f) => ({ ...f, status: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Sort order</Label>
                      <Input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {loadingItems ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : items.length === 0 ? (
              <p className="text-gray-500 py-8">No timeline items yet. Add one to show “How we do it” on the service page.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => {
                  const id = (item as TimelineItem & { id?: number }).id
                  return (
                    <li
                      key={id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-white"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.category} {item.date && ` · ${item.date}`} · {item.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => id != null && handleDelete(id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
