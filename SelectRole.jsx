import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { GraduationCap, Building2, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

const ROLES = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student / Volunteer',
    desc: 'Browse NGOs, apply for opportunities, attend events, and build your impact portfolio.',
    perks: ['Skill-based NGO matching', 'Event registration & certificates', 'Points & badges system', 'Direct chat with NGOs'],
    gradient: 'from-brand-500 to-purple-500',
  },
  {
    id: 'ngo',
    icon: Building2,
    title: 'NGO / Organisation',
    desc: 'Post opportunities, manage volunteers, create events, and connect with passionate students.',
    perks: ['Post volunteer opportunities', 'Manage applications', 'Create & host events', 'Chat with volunteers'],
    gradient: 'from-emerald-500 to-teal-500',
  },
]

export default function SelectRole() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await api.post('/auth/set-role', { role: selected })
      await refreshUser()
      toast.success('Welcome to Volunteer Connect! 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="section-heading mb-3">How will you use <span className="gradient-text">Volunteer Connect?</span></h1>
          <p className="text-slate-400">Choose your role — you can always update it later.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {ROLES.map(({ id, icon: Icon, title, desc, perks, gradient }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={clsx(
                'text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden',
                selected === id
                  ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/20'
                  : 'border-surface-700 bg-surface-800/40 hover:border-surface-600'
              )}
            >
              {selected === id && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-display text-xl text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>

              <ul className="space-y-1.5">
                {perks.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={confirm}
            disabled={!selected || loading}
            className={clsx(
              'btn-primary text-base px-8 py-3.5',
              (!selected || loading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>Continue as {selected ? ROLES.find(r => r.id === selected)?.title.split('/')[0].trim() : '…'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
