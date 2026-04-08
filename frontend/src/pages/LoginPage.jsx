import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import healingStoryClient from '../api/client'
import styles from '../styles/LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, setUser } = useUserStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  const handleLogin = async () => {
    if (!email.trim()) return alert('이메일을 입력해줘요 🌿')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('올바른 이메일 형식이 아니에요')
    setLoading(true)
    try {
      const loginResponse = await healingStoryClient.post('/auth/login', { email })
      localStorage.setItem('access_token', loginResponse.data.data.access_token)
      setUser(loginResponse.data.data.user)
      navigate('/')
    } catch {
      alert('로그인에 실패했어요. 다시 시도해줘요 🌿')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <div className={styles.inner}>
        <div className={styles.avatar}>🌱</div>
        <div className={styles.title}>나의 치유 이야기</div>
        <div className={styles.sub}>
          링키와 함께 매일 조금씩,<br />
          당신만의 회복 여정을 기록해요 💚
        </div>
        <input
          className={styles.input}
          type="email"
          placeholder="이메일 주소를 입력해요"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`${styles.loginBtn}${loading ? ` ${styles.loginBtnLoading}` : ''}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '링키가 기다리고 있어요... 🌱' : '시작하기 🍀'}
        </button>
        <div className={styles.notice}>
          이메일만 입력하면 바로 시작할 수 있어요.<br />
          비밀번호가 필요 없어요. 링키는 판단하지 않아요 🌿
        </div>
      </div>
    </div>
  )
}
