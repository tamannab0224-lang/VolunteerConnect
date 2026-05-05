import { useAuth } from '../context/AuthContext'
import StudentDashboard from '../components/dashboard/StudentDashboard'
import NGODashboard from '../components/dashboard/NGODashboard'
import AdminDashboard from '../components/dashboard/AdminDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === 'student') return <StudentDashboard />
  if (user?.role === 'ngo')     return <NGODashboard />
  if (user?.role === 'admin')   return <AdminDashboard />

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-slate-400">Loading your dashboard…</p>
    </div>
  )
}
