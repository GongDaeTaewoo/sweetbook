import { useUserStore } from '../store/userStore'
import { logout } from '../api/authApi'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { user, setUser, clearUser } = useUserStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    clearUser()
    navigate('/login')
  }

  return { user, setUser, handleLogout }
}
