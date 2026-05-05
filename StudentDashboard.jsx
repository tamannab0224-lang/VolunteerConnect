import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Zap, BookmarkCheck, ClipboardList, Trophy, ArrowRight, Star, MapPin } from 'lucide-react'

const BADGE_DEFS = {
  welcome_volunteer:   { label: 'Welcome Volunteer',   icon: '🌱' },
  first_application:   { label: 'First Application',   icon: '📝' },
  active_contributor:  { label: 'Active Contributor',  icon: '⚡' },
  event_goer:          { label: 'Event Goer',          icon: '🎪' },
  team_player:         { label: 'Team Player',         icon: '🤝' },
  certified_volunteer: { label: 'Certified Volunteer', icon: '🏆' },
  profile_complete:    { label: 'Profile Complete',    icon: '✨' },
}

function MatchCard({ ngo }) {
  const score = ngo.match_score || 0
  const color = score >= 70 ? 'text-emerald-400 border-emerald-500/40' : score >= 40 ? 'text-amber-400 border-amber-500/40' : 'text-slate-400 border-slate-600'

  return (
    <Link to={`/ngos/${ngo.id}`} className="card-hover glow-hover p-4 flex gap-4">
      <div className={`match-ring flex-shrink-0 border ${color}`}>
        {score}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{ngo.name}</p>
        <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" />{ngo.city}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {ngo.required_skills?.slice(0, 3).map(s => (
            <span key={s.name} className="badge-brand text-xs">{s.name}</span>
          ))}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0 self-center" />
    </Link>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [matched, setMatched]   = useState([])
  const [myApps, setMyApps]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/ngos/matched').then(r => setMatched(r.data.slice(0, 5))).catch(() => {}),
      api.get('/applications/my').then(r => setMyApps(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const badges = user?.badges || []
  const points = user?.points || 0
  const level  = Math.floor(points / 100) + 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400">Here's your volunteer dashboard</p>
        </div>
        <Link to="/profile" className="btn-secondary">
          Edit Profile
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Points',    value: points,         icon: Star,          color: 'text-amber-400' },
          { label: 'Volunteer Level', value: `Lv. ${level}`, icon: Trophy,        color: 'text-brand-400' },
          { label: 'Applications',    value: myApps.length,  icon: ClipboardList, color: 'text-emerald-400' },
          { label: 'Badges Earned',   value: badges.length,  icon: Zap,           color: 'text-purple-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-slate-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Matched NGOs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-400" /> Matched NGOs
            </h2>
            <Link to="/ngos" className="btn-ghost text-xs">View all →</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            </div>
          ) : matched.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-slate-400 mb-3">Add skills to your profile to see matches.</p>
              <Link to="/profile" className="btn-primary text-sm">Add Skills</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matched.map(ngo => <MatchCard key={ngo.id} ngo={ngo} />)}
            </div>
          )}

          {/* Recent Applications */}
          <div className="flex items-center justify-between mt-8">
            <h2 className="font-display text-xl text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-400" /> My Applications
            </h2>
          </div>

          {myApps.length === 0 ? (
            <div className="card p-6 text-center text-slate-500 text-sm">
              No applications yet. <Link to="/ngos" className="text-brand-400 hover:underline">Browse NGOs →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myApps.slice(0, 5).map(app => (
                <div key={app.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{app.ngo_name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={
                    app.status === 'accepted' ? 'badge-green' :
                    app.status === 'rejected' ? 'badge-red' :
                    'badge-amber'
                  }>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Badges & Points */}
        <div className="space-y-6">
          {/* Points progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-white">Level {level}</h3>
              <span className="text-xs text-brand-400">{points % 100}/100 XP</span>
            </div>
            <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-700"
                style={{ width: `${points % 100}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-2">{100 - (points % 100)} XP to Level {level + 1}</p>
          </div>

          {/* Badges */}
          <div className="card p-5">
            <h3 className="font-display text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Badges
            </h3>
            {badges.length === 0 ? (
              <p className="text-slate-500 text-sm">Complete actions to earn badges!</p>
            ) : (
              <div className="space-y-3">
                {badges.map(b => {
                  const def = BADGE_DEFS[b] || { label: b, icon: '🎖️' }
                  return (
                    <div key={b} className="flex items-center gap-3">
                      <span className="text-2xl">{def.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{def.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Saved NGOs link */}
          <Link to="/profile?tab=saved" className="card p-5 flex items-center gap-3 hover:border-brand-500/40 transition-colors">
            <BookmarkCheck className="w-5 h-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-white">Saved NGOs</p>
              <p className="text-xs text-slate-500">View your bookmarks</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  )
}
