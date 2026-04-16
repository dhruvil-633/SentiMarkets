import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { authAPI } from '../api/client'

export function useAuth() {
  const { user, accessToken, setUser, clearAuth } = useStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setUser(data.user, data.access_token)
      navigate('/app/dashboard')
    }
  })

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      setUser(data.user, data.access_token)
      navigate('/app/dashboard')
    }
  })

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSettled: () => {
      clearAuth()
      navigate('/')
    }
  })

  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error?.response?.data?.detail,
    registerError: registerMutation.error?.response?.data?.detail,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
  }
}
