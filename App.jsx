import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'

// Pages
import Landing      from './pages/Landing'
import AuthCallback from './pages/AuthCallback'
import SelectRole   from './pages/SelectRole'
import Dashboard    from './pages/Dashboard'
import NGOListings  from './pages/NGOListings'
import NGODetail    from './pages/NGODetail'
import Events       from './pages/Events'
import ChatPage     from './pages/ChatPage'
import Profile      from './pages/Profile'
import AdminPanel   from './pages/AdminPanel'
import Leaderboard  from './pages/Leaderboard'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>
  if (!user) return <Navigate to="/" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

function Spinner() {
  return (
    <div className="w-10 h-10 rounded-full border-2 border-surface-700 border-t-brand-500 animate-spin" />
  )
}

function AppInner() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/"               element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/auth/callback"  element={<AuthCallback />} />
        <Route path="/select-role"    element={<SelectRole />} />
        <Route path="/ngos"           element={<NGOListings />} />
        <Route path="/ngos/:id"       element={<NGODetail />} />
        <Route path="/events"         element={<Events />} />
        <Route path="/leaderboard"    element={<Leaderboard />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/chat/:userId" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
