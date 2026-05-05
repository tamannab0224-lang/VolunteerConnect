import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart } from 'lucide-react'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const needsRole = params.get('needs_role') === 'true'

    if (token) {
      login(token)
      if (needsRole) {
        navigate('/select-role', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center animate-pulse-slow shadow-xl shadow-brand-500/30">
        <Heart className="w-8 h-8 text-white fill-white" />
      </div>
      <p className="text-slate-400 text-sm">Signing you in…</p>
      <div className="w-6 h-6 rounded-full border-2 border-surface-700 border-t-brand-500 animate-spin" />
    </div>
  )
}
