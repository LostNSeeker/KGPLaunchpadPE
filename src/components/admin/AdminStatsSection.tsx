import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiUrl } from '../../config'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Loader2, Save, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SiteStat {
    key: string
    label: string
    value: string
}

export const AdminStatsSection: React.FC = () => {
    const { token } = useAuth()
    const [stats, setStats] = useState<SiteStat[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    const fetchStats = async () => {
        setLoading(true)
        try {
            const res = await fetch(getApiUrl('/api/admin/stats'), {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
            toast.error('Failed to load stats')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchStats()
    }, [token])

    const handleUpdate = async (stat: SiteStat) => {
        setUpdating(stat.key)
        try {
            const res = await fetch(getApiUrl('/api/admin/stats'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stat)
            })

            if (res.ok) {
                toast.success('Stat updated')
            } else {
                toast.error('Failed to update')
            }
        } catch {
            toast.error('Error updating stat')
        } finally {
            setUpdating(null)
        }
    }

    const handleChange = (index: number, field: 'label' | 'value', newValue: string) => {
        const newStats = [...stats]
        newStats[index] = { ...newStats[index], [field]: newValue }
        setStats(newStats)
    }

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Site Statistics (Dynamic)</CardTitle>
                <Button variant="outline" size="sm" onClick={fetchStats}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {stats.map((stat, index) => (
                        <div key={stat.key} className="flex items-end gap-4 p-4 border rounded-lg bg-gray-50/50">
                            <div className="flex-1 space-y-2">
                                <Label className="text-xs text-gray-500 font-mono">{stat.key}</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Label</Label>
                                        <Input 
                                            value={stat.label} 
                                            onChange={(e) => handleChange(index, 'label', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Value</Label>
                                        <Input 
                                            value={stat.value} 
                                            onChange={(e) => handleChange(index, 'value', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleUpdate(stat)}
                                disabled={updating === stat.key}
                                size="icon"
                            >
                                {updating === stat.key ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                            </Button>
                        </div>
                    ))}
                    {stats.length === 0 && <div className="text-center text-gray-500">No stats found. Run seed script.</div>}
                </div>
            </CardContent>
        </Card>
    )
}
