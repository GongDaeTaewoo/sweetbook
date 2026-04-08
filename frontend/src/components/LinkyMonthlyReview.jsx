import styles from '../styles/LinkyMonthlyReview.module.css'

export default function LinkyMonthlyReview({ review }) {
  if (!review) return null
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.headerEmoji}>📖</span>
        <span className={styles.title}>링키의 이번 달 리뷰</span>
      </div>
      <div className={styles.sub}>한 달 동안 정말 잘 해냈어요 💚</div>
      <div className={styles.label}>이번 달 한 줄</div>
      <div className={styles.oneline}>{review.oneline}</div>
      <div className={styles.label}>링키의 격려</div>
      <div className={styles.cheer}>{review.cheer}</div>
      <div className={styles.closing}>
        당신은 이만큼 왔어요. 링키가 항상 기억할게요 🌱
      </div>
    </div>
  )
}
