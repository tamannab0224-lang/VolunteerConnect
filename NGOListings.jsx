import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Search, MapPin, Filter, BookmarkPlus, ArrowRight, Users, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const CATEGORIES = ['All', 'Education', 'Environment', 'Health', 'Technology', 'Social', 'Legal', 'Arts']

function NGOCard({ ngo, onSave, isSaved }) {
  const categoryColors = {
    Education: 'bg-blue-500/20 text-blue-400',
    Environment: 'bg-emerald-500/20 text-emerald-400',
    Health: 'bg-red-500/20 text-red-400',
    Technology: 'bg-purple-500/20 text-purple-400',
  }

  return (
    <div className="card-hover glow-hover flex flex-col">
      {/* Gradient top stripe by category */}
      <div className="h-1.5 bg-gradient-to-r from-brand-500 to-purple-500 flex-shrink-0" />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Link to={`/ngos/${ngo.id}`} className="font-display text-lg text-white hover:text-brand-400 transition-colors">
              {ngo.name}
            </Link>
            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />{ngo.city}, {ngo.country}
            </p>
          </div>
          {ngo.match_score !== undefined && (
            <div className={clsx(
              'match-ring text-xs flex-shrink-0',
              ngo.match_score >= 70 ? 'border-emerald-500/40 text-emerald-400' :
              ngo.match_score >= 40 ? 'border-amber-500/40 text-amber-400' :
              'border-slate-600 text-slate-400'
            )}>
              {ngo.match_score}%
            </div>
          )}
        </div>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {ngo.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={clsx('badge text-xs', categoryColors[ngo.category] || 'bg-surface-700 text-slate-400')}>
            {ngo.category}
          </span>
          {ngo.required_skills?.slice(0, 2).map(s => (
            <span key={s.name} className="badge-brand text-xs">{s.name}</span>
          ))}
          {ngo.required_skills?.length > 2 && (
            <span className="badge-slate text-xs">+{ngo.required_skills.length - 2}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-surface-700/50">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ngo.volunteer_count || 0}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{ngo.rating || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSave(ngo.id)}
              className={clsx('p-1.5 rounded-lg transition-colors', isSaved ? 'text-brand-400 bg-brand-500/10' : 'text-slate-500 hover:text-brand-400 hover:bg-brand-500/10')}
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
            <Link to={`/ngos/${ngo.id}`} className="btn-primary text-xs py-1.5 px-3">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NGOListings() {
  const { user } = useAuth()
  const [ngos, setNgos]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [saved, setSaved]         = useState([])
  const [search, setSearch]       = useState('')
  const [city, setCity]           = useState('')
  const [category, setCategory]   = useState('All')
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchNGOs()
  }, [search, city, category, page])

  useEffect(() => {
    if (user) {
      api.get('/users/saved-ngos').then(r => setSaved(r.data.map(n => n.id))).catch(() => {})
    }
  }, [user])

  const fetchNGOs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (search) params.set('search', search)
      if (city)   params.set('city', city)
      if (category !== 'All') params.set('category', category)
      const { data } = await api.get(`/ngos?${params}`)
      setNgos(data.ngos)
      setTotalPages(data.pages)
    } catch { }
    setLoading(false)
  }

  const toggleSave = async (ngoId) => {
    if (!user) { toast.error('Sign in to save NGOs'); return }
    try {
      const { data } = await api.post(`/users/save-ngo/${ngoId}`)
      setSaved(prev => data.saved ? [...prev, ngoId] : prev.filter(id => id !== ngoId))
      toast.success(data.saved ? 'NGO saved!' : 'Removed from saved')
    } catch { toast.error('Failed to save') }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-heading mb-2">Discover NGOs</h1>
        <p className="text-slate-400">Find organisations that match your skills and passions.</p>
      </div>

      {/* Search & Filters */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Search NGOs…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Filter by city…"
            value={city}
            onChange={e => { setCity(e.target.value); setPage(1) }}
          />
        </div>
        <select
          className="input"
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => { setCategory(c); setPage(1) }}
            className={clsx(
              'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
              category === c
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'bg-surface-800 text-slate-400 hover:text-white hover:bg-surface-700'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-60 rounded-2xl" />)}
        </div>
      ) : ngos.length === 0 ? (
        <div className="card p-16 text-center text-slate-500">
          No NGOs found matching your criteria.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map(ngo => (
            <NGOCard
              key={ngo.id}
              ngo={ngo}
              onSave={toggleSave}
              isSaved={saved.includes(ngo.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
          >← Prev</button>
          <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
          >Next →</button>
        </div>
      )}
    </div>
  )
}
