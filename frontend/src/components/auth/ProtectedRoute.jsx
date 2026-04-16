import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export default function ProtectedRoute() {
  const { user, accessToken } = useStore()
  if (!user || !accessToken) return <Navigate to="/login" replace />
  return <Outlet />
}
