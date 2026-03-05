import React, { useState, useEffect } from 'react'
import { Plus, Loader2, Pencil, Trash2, ExternalLink, BookOpen } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'react-hot-toast'
import { Card } from '../../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { Badge } from '../../components/ui/badge'

interface Resource {
    id: number
    title: string
    description: string
    category: string
    link: string
    image_url: string
    created_at: string
}

const CATEGORIES = ['news', 'policies', 'guides', 'tools', 'reports']

export const AdminResourcesPage: React.FC = () => {
    const { token } = useAuth()
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [filterCategory, setFilterCategory] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'news',
        link: '',
        image_url: ''
    })

    const fetchResources = async () => {
        try {
            const url = filterCategory
                ? getApiUrl(`/api/resources?category=${filterCategory}`)
                : getApiUrl('/api/resources')
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setResources(data)
            }
        } catch (error) {
            console.error('Error fetching resources:', error)
            toast.error('Failed to load resources')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchResources()
    }, [token, filterCategory])

    const resetForm = () => {
        setFormData({ title: '', description: '', category: 'news', link: '', image_url: '' })
        setIsEditMode(false)
        setEditingId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const openEditModal = (resource: Resource) => {
        setFormData({
            title: resource.title,
            description: resource.description,
            category: resource.category,
            link: resource.link,
            image_url: resource.image_url || ''
        })
        setIsEditMode(true)
        setEditingId(resource.id)
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = isEditMode && editingId
            ? getApiUrl(`/api/resources/${editingId}`)
            : getApiUrl('/api/resources')
        const method = isEditMode ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(isEditMode ? 'Resource updated' : 'Resource created')
                setIsModalOpen(false)
                fetchResources()
                resetForm()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to save resource')
            }
        } catch (error) {
            console.error('Error saving resource:', error)
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return

        try {
            const res = await fetch(getApiUrl(`/api/resources/${id}`), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                toast.success('Resource deleted')
                fetchResources()
            } else {
                const error = await res.json()
                toast.error(error.error || 'Failed to delete resource')
            }
        } catch (error) {
            console.error('Error deleting resource:', error)
            toast.error('Something went wrong')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Resources</h1>
                    <p className="text-gray-500">Create and manage startup resources for the community.</p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                </Button>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                    variant={filterCategory === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory('')}
                >
                    All
                </Button>
                {CATEGORIES.map(cat => (
                    <Button
                        key={cat}
                        variant={filterCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterCategory(cat)}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {resources.map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-48 h-48 md:h-auto relative bg-gray-100">
                                {resource.image_url ? (
                                    <img src={resource.image_url} alt={resource.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <BookOpen className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge variant="outline" className="mb-2">{resource.category}</Badge>
                                            <h3 className="text-xl font-bold">{resource.title}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(resource)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(resource.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 mt-2 line-clamp-2">{resource.description}</p>
                                    {resource.link && (
                                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-sm mt-2 hover:underline">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            Visit Link
                                        </a>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t text-sm text-gray-400">
                                    Added {new Date(resource.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {resources.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No resources yet</h3>
                        <p className="text-gray-500">Create your first resource to get started.</p>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">Link URL</Label>
                            <Input id="link" name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">Image URL (Optional)</Label>
                            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Update Resource' : 'Create Resource'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
