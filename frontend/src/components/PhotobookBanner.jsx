import { useNavigate } from 'react-router-dom'
import styles from '../styles/PhotobookBanner.module.css'

export default function PhotobookBanner({ type }) {
  const navigate = useNavigate()
  const isMonthly = type === 'monthly'

  return (
    <div className={styles.banner}>
      <div className={styles.emoji}>{isMonthly ? '📖' : '🌿'}</div>
      <div className={styles.title}>
        {isMonthly ? '한 달의 이야기를 책으로 남겨요' : '최근 이야기를 일기로 만들어요'}
      </div>
      <div className={styles.desc}>
        {isMonthly
          ? '링키와 함께한 30일이 쌓였어요.\n당신의 회복 여정을 소중한 책으로 만들어보세요 💚'
          : '24일의 기록이 쌓였어요.\n링키의 격려와 함께 포토북을 만들어볼까요? 🍀'}
      </div>
      <button className={styles.btn} onClick={() => navigate('/photobook/order')}>
        포토북 만들기 🌱
      </button>
    </div>
  )
}
