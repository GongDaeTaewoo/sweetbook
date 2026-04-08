import styles from '../styles/LinkyWeeklyReview.module.css'

export default function LinkyWeeklyReview({ review }) {
  if (!review) return null
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.headerEmoji}>🌿</span>
        <span className={styles.title}>링키의 이번 주 리뷰</span>
      </div>
      <div className={styles.label}>이번 주 한 줄</div>
      <div className={styles.oneline}>{review.oneline}</div>
      <div className={styles.label}>링키의 격려</div>
      <div className={styles.cheer}>{review.cheer}</div>
    </div>
  )
}
