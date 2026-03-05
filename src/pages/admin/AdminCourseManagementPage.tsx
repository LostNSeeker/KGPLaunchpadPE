import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import type { Course, Enrollment } from '../../types/course'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Loader2, ArrowLeft, Mail, Save, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export const AdminCourseManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { token } = useAuth()
    const [course, setCourse] = useState<Course | null>(null)
    const [students, setStudents] = useState<Enrollment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState<Partial<Course>>({})

    useEffect(() => {
        if (id) fetchData()
    }, [id])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [courseRes, studentsRes] = await Promise.all([
                fetch(getApiUrl(`/api/courses/${id}`)),
                fetch(getApiUrl(`/api/admin/courses/${id}/students`), {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ])

            if (courseRes.ok) {
                const courseData = await courseRes.json()
                setCourse(courseData)
                setFormData(courseData)
            }
            
            if (studentsRes.ok) {
                const studentsData = await studentsRes.json()
                setStudents(studentsData)
            }

        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load course details')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch(getApiUrl(`/api/courses/${id}`), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success('Course updated successfully')
                const updatedCourse = await res.json()
                setCourse(updatedCourse)
            } else {
                toast.error('Failed to update course')
            }
        } catch {
            toast.error('Error saving course')
        } finally {
            setIsSaving(false)
        }
    }

    const handleChange = (field: keyof Course, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>
    if (!course) return <div className="container mx-auto p-4 text-center py-20">Course not found</div>

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex items-center justify-between mb-6">
                 <Button variant="ghost" className="pl-0" asChild>
                    <Link to="/admin/courses">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="details">
                <TabsList className="mb-6">
                    <TabsTrigger value="details">Course Details</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum & Tags</TabsTrigger>
                    <TabsTrigger value="students">Enrolled Students ({students.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Course Title</Label>
                                <Input value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea rows={4} value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Category</Label>
                                    <Select value={formData.category} onValueChange={val => handleChange('category', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="IT & Software">IT & Software</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Business">Business</SelectItem>
                                            <SelectItem value="Photography">Photography</SelectItem>
                                            <SelectItem value="Music">Music</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Price (₹)</Label>
                                    <Input type="number" value={formData.price || ''} onChange={e => handleChange('price', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" value={formData.start_date || ''} onChange={e => handleChange('start_date', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Duration</Label>
                                    <Input value={formData.duration || ''} onChange={e => handleChange('duration', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Image URL</Label>
                                <Input value={formData.image_url || ''} onChange={e => handleChange('image_url', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="instructor" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Instructor Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input value={formData.instructor_name || ''} onChange={e => handleChange('instructor_name', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Image URL</Label>
                                    <Input value={formData.instructor_image || ''} onChange={e => handleChange('instructor_image', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Bio</Label>
                                <Textarea rows={3} value={formData.instructor_bio || ''} onChange={e => handleChange('instructor_bio', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Curriculum Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>What you'll learn (comma separated)</Label>
                                <Textarea rows={3} value={formData.what_you_learn || ''} onChange={e => handleChange('what_you_learn', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Requirements</Label>
                                <Textarea rows={3} value={formData.requirements || ''} onChange={e => handleChange('requirements', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Skill Tags</Label>
                                <Input value={formData.skill_tags || ''} onChange={e => handleChange('skill_tags', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Total Lessons Count</Label>
                                <Input type="number" value={formData.lessons_count || ''} onChange={e => handleChange('lessons_count', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {students.length > 0 ? (
                                <div className="divide-y">
                                    {students.map(student => (
                                        <div key={student.id} className="py-4 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage src={student.avatar ? getApiUrl(`/api/profile/picture/${student.avatar}`) : undefined} />
                                                    <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{student.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {student.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm text-right">
                                                    <div className="text-gray-900 font-medium capitalize">{student.payment_status}</div>
                                                    <div className="text-gray-500 text-xs">
                                                        Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Badge variant={
                                                    student.status === 'approved' ? 'default' : 
                                                    student.status === 'rejected' ? 'destructive' : 'secondary'
                                                }>
                                                    {student.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No students enrolled yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
