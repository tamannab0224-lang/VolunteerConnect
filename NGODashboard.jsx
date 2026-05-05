import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Users, Calendar, ClipboardList, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

export default function NGODashboard() {
  const { user } = useAuth()
  const [ngo, setNgo]         = useState(null)
  const [apps, setApps]       = useState([])
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const ngoRes = await api.get('/ngos/my/profile')
      setNgo(ngoRes.data)
      const [appsRes, eventsRes] = await Promise.all([
        api.get(`/applications/ngo/${ngoRes.data.id}`),
        api.get('/events'),
      ])
      setApps(appsRes.data)
      setEvents(eventsRes.data.filter(e => e.ngo_id === ngoRes.data.id))
    } catch {
      // NGO not created yet
    } finally {
      setLoading(false)
    }
  }

  const updateAppStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status })
      toast.success(`Application ${status}`)
      loadData()
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
      {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
    </div>
  )

  if (!ngo) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="card p-10">
        <div className="text-5xl mb-6">🏢</div>
        <h2 className="font-display text-2xl text-white mb-3">Create Your NGO Profile</h2>
        <p className="text-slate-400 mb-6">Set up your organisation to start posting opportunities and connecting with volunteers.</p>
        <Link to="/profile" className="btn-primary">
          <Plus className="w-4 h-4" /> Create NGO Profile
        </Link>
      </div>
    </div>
  )

  const pending  = apps.filter(a => a.status === 'pending')
  const accepted = apps.filter(a => a.status === 'accepted')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">{ngo.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={ngo.status === 'approved' ? 'badge-green' : ngo.status === 'pending' ? 'badge-amber' : 'badge-red'}>
              {ngo.status}
            </span>
            <span className="text-slate-500 text-sm">{ngo.city}, {ngo.country}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/ngos/${ngo.id}`} className="btn-secondary text-sm">View Public Page</Link>
        </div>
      </div>

      {ngo.status === 'pending' && (
        <div className="card border-amber-500/30 bg-amber-500/5 p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-amber-400 font-medium text-sm">Pending Admin Approval</p>
            <p className="text-slate-400 text-xs">Your NGO profile is under review. You'll be notified once approved.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Applications', value: apps.length,     icon: ClipboardList, color: 'text-brand-400' },
          { label: 'Pending Review',      value: pending.length,  icon: ClipboardList, color: 'text-amber-400' },
          { label: 'Accepted Volunteers', value: accepted.length, icon: Users,         color: 'text-emerald-400' },
          { label: 'Events Created',      value: events.length,   icon: Calendar,      color: 'text-purple-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-slate-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Applications */}
        <div>
          <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-400" /> Applications
          </h2>
          {apps.length === 0 ? (
            <div className="card p-6 text-center text-slate-500 text-sm">
              No applications yet. Ensure your NGO is approved.
            </div>
          ) : (
            <div className="space-y-3">
              {apps.slice(0, 8).map(app => (
                <div key={app.id} className="card p-4 flex items-center gap-3">
                  <img
                    src={app.student_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.student_name || '?')}&background=6366f1&color=fff`}
                    alt=""
                    className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{app.student_name}</p>
                    <p className="text-xs text-slate-500">{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  {app.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateAppStatus(app.id, 'accepted')}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateAppStatus(app.id, 'rejected')}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className={app.status === 'accepted' ? 'badge-green' : 'badge-red'}>{app.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" /> Events
            </h2>
            <Link to="/events" className="btn-ghost text-xs">
              <Plus className="w-3.5 h-3.5" /> New Event
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="card p-6 text-center text-slate-500 text-sm">
              No events yet. Create your first event to engage volunteers.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{ev.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(ev.date).toLocaleDateString()} · {ev.location}
                      </p>
                    </div>
                    <span className="badge-brand text-xs">{ev.registrations?.length || 0} registered</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
