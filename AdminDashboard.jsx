import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Users, Building2, ClipboardList, Calendar, MessageCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [pending, setPending] = useState([])
  const [users, setUsers]   = useState([])
  const [tab, setTab]       = useState('overview')

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/admin/ngos/pending').then(r => setPending(r.data)).catch(() => {})
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const reviewNGO = async (id, status) => {
    try {
      await api.put(`/admin/ngos/${id}/status`, { status, reason: '' })
      toast.success(`NGO ${status}`)
      setPending(pending.filter(n => n.id !== id))
    } catch { toast.error('Failed') }
  }

  const banUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/ban`)
      toast.success('User banned')
      setUsers(users.map(u => u.id === id ? { ...u, is_active: false } : u))
    } catch { toast.error('Failed') }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl text-white mb-2">Admin Panel</h1>
      <p className="text-slate-400 mb-8">Manage users, NGOs, and platform health</p>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Users',    value: stats.users,         icon: Users,         color: 'text-brand-400' },
            { label: 'Students',       value: stats.students,      icon: Users,         color: 'text-purple-400' },
            { label: 'NGOs Approved',  value: stats.ngos_approved, icon: Building2,     color: 'text-emerald-400' },
            { label: 'NGOs Pending',   value: stats.ngos_pending,  icon: Building2,     color: 'text-amber-400' },
            { label: 'Applications',   value: stats.applications,  icon: ClipboardList, color: 'text-blue-400' },
            { label: 'Events',         value: stats.events,        icon: Calendar,      color: 'text-pink-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-surface-700/50">
        {['overview', 'ngos', 'users'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t === 'ngos' ? `NGOs (${pending.length} pending)` : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Pending NGOs */}
      {tab === 'ngos' && (
        <div className="space-y-4">
          <h2 className="font-display text-xl text-white">Pending NGO Approvals</h2>
          {pending.length === 0 ? (
            <div className="card p-8 text-center text-slate-500">No pending NGOs 🎉</div>
          ) : pending.map(ngo => (
            <div key={ngo.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-white">{ngo.name}</p>
                <p className="text-sm text-slate-400 mt-0.5">{ngo.category} · {ngo.city}, {ngo.country}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ngo.description}</p>
                <p className="text-xs text-slate-600 mt-1">{ngo.contact_email}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => reviewNGO(ngo.id, 'approved')} className="btn-primary text-xs py-2 px-4">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => reviewNGO(ngo.id, 'rejected')} className="btn-ghost text-xs py-2 px-4 border border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div>
          <h2 className="font-display text-xl text-white mb-4">All Users</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-700/50">
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">User</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-medium hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-surface-700/30 hover:bg-surface-700/20">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || '?')}&background=6366f1&color=fff`}
                        className="w-7 h-7 rounded-full object-cover"
                        alt=""
                      />
                      <div>
                        <p className="text-white text-xs font-medium">{u.name}</p>
                        <p className="text-slate-500 text-xs hidden sm:block">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge-brand capitalize">{u.role || 'unset'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={u.is_active ? 'badge-green' : 'badge-red'}>
                        {u.is_active ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.is_active && u.role !== 'admin' && (
                        <button onClick={() => banUser(u.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
