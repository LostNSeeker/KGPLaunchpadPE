import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Loader2, BookOpen, Plus, Eye, Edit, Trash2, Calendar, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { excerptFromHtml } from '../lib/dataUtils'
import { getApiUrl } from '../config'

interface BlogPost {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  updated_at: string
}

export const AlumniBlogsPage: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadPosts = async () => {
      if (!token) return
      
      try {
        const res = await fetch(getApiUrl('/api/alumni/blog-posts'), {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadPosts()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access this page.</p>
      </div>
    )
  }

  if (user.role !== 'alumni') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Only alumni can manage blog posts.</p>
      </div>
    )
  }

  const handleEdit = (postId: number) => {
    navigate(`/alumni/blogs/${postId}/edit`)
  }

  const handleDelete = async (postId: number) => {
    if (!token) return
    const ok = window.confirm('Delete this blog post? This cannot be undone.')
    if (!ok) return
    setDeletingId(postId)
    try {
      const res = await fetch(getApiUrl(`/api/blog/${postId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId))
      }
    } catch {
      // noop; could show a toast here
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              My Blog Posts
            </h1>
            <p className="text-gray-600">Manage your blog posts and share insights with the community.</p>
          </div>
          <Button 
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Link to="/alumni/create-blog">
              <Plus className="mr-2 h-4 w-4" />
              Write Blog Post
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">No blog posts yet</CardTitle>
              <CardDescription className="text-gray-600 mb-6">Share your insights and experiences with the community.</CardDescription>
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Link to="/alumni/create-blog">
                  <Plus className="mr-2 h-4 w-4" />
                  Write Blog Post
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">{post.title}</CardTitle>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Created</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {excerptFromHtml(post.content, 200)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      >
                        <Link to={`/blog/${post.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(post.id)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className={deletingId === post.id ? 'opacity-60 cursor-not-allowed' : ''}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
