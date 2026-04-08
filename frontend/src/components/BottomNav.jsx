import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/BottomNav.module.css'

const TABS = [
  { path: '/',               emoji: '🏠', label: '홈' },
  { path: '/diary/write',    emoji: '✏️', label: '일기' },
  { path: '/photobook/order',emoji: '📖', label: '포토북' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { handleLogout } = useAuth()

  return (
    <nav className={styles.nav}>
      {TABS.map(tab => {
        const active = pathname === tab.path
        return (
          <button
            key={tab.path}
            className={`${styles.tab}${active ? ` ${styles.tabActive}` : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className={styles.emoji}>{tab.emoji}</span>
            <span className={`${styles.label}${active ? ` ${styles.labelActive}` : ''}`}>{tab.label}</span>
          </button>
        )
      })}
      <button className={styles.tab} onClick={handleLogout}>
        <span className={styles.emoji}>🚪</span>
        <span className={styles.label}>로그아웃</span>
      </button>
    </nav>
  )
}
