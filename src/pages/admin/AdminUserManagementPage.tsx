import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Loader2, Search, CheckCircle, ShieldAlert } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

interface User {
    id: number
    name: string
    email: string
    role: string
    is_approved: boolean
    is_blocked: boolean
    created_at: string
    avatar?: string
    alumni_type?: string
}

export const AdminUserManagementPage: React.FC = () => {
    const { token } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('student')
    const [processingId, setProcessingId] = useState<number | null>(null)

    const fetchUsers = async (role: string) => {
        setLoading(true)
        try {
            console.log(`Fetching users for role: ${role}`)
            const res = await fetch(getApiUrl(`/api/admin/users?role=${role}`), {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log(`Fetch response status: ${res.status}`)

            if (res.ok) {
                const data = await res.json()
                console.log(`Fetched ${data.length} users:`, data)
                setUsers(data)
            } else {
                const text = await res.text()
                console.error('Failed to fetch users:', text)
                toast.error('Failed to load users')
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchUsers(activeTab)
    }, [token, activeTab])

    const toggleBlock = async (userId: number, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return

        setProcessingId(userId)
        try {
            const res = await fetch(getApiUrl(`/api/admin/users/${userId}/block`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ block: !currentStatus })
            })

            if (res.ok) {
                toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`)
                setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u))
            } else {
                const err = await res.json()
                toast.error(err.error || 'Failed to update user status')
            }
        } catch {
            toast.error('Something went wrong')
        } finally {
            setProcessingId(null)
        }
    }

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-500">Manage users, block/unblock accounts.</p>
                </div>
            </div>

            <Tabs defaultValue="student" onValueChange={setActiveTab} className="mb-8">
                <TabsList>
                    <TabsTrigger value="student">Students</TabsTrigger>
                    <TabsTrigger value="alumni">Founders/Alumni</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2 my-4">
                    <Search className="text-gray-400 h-5 w-5" />
                    <Input 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                <TabsContent value={activeTab}>
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No users found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredUsers.map(user => (
                                <Card key={user.id} className={`${user.is_blocked ? 'bg-red-50 border-red-200' : ''}`}>
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={user.avatar ? getApiUrl(`/api/profile/picture/${user.avatar}`) : undefined} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {user.name}
                                                    {user.is_blocked && <Badge variant="destructive" className="text-xs">BLOCKED</Badge>}
                                                    
                                                    {user.role === 'student' && (
                                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                            Student
                                                        </Badge>
                                                    )}
                                                    
                                                    {user.role === 'alumni' && (
                                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                            {user.alumni_type || 'Alumni'}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="text-right text-sm text-gray-500">
                                                Joined: {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                            
                                            {user.role !== 'admin' && (
                                                <Button 
                                                    variant={user.is_blocked ? "default" : "destructive"}
                                                    size="sm"
                                                    onClick={() => toggleBlock(user.id, user.is_blocked)}
                                                    disabled={processingId === user.id}
                                                >
                                                    {processingId === user.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : user.is_blocked ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Unblock
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldAlert className="h-4 w-4 mr-2" />
                                                            Block
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
