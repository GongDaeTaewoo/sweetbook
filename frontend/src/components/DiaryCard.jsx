import styles from '../styles/DiaryCard.module.css'

const MOOD_EMOJI = { 1: '😔', 2: '😟', 3: '😐', 4: '🙂', 5: '😊' }

export default function DiaryCard({ diary }) {
  const { written_at: date, mood, content, photo_urls: photos = [], linky_oneline, linky_cheer } = diary

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.date}>{date}</span>
        <span className={styles.mood}>{MOOD_EMOJI[mood] || '😐'}</span>
      </div>
      {content && <p className={styles.text}>{content}</p>}
      {photos.length > 0 && (
        <div className={styles.photos}>
          {photos.slice(0, 3).map((url, i) => (
            <img key={i} src={url} alt="" className={styles.photo} />
          ))}
        </div>
      )}
      {linky_oneline && (
        <div className={styles.linkyBox}>
          <div className={styles.linkyLabel}>🌱 링키의 오늘 한 줄</div>
          <div className={styles.linkyOneline}>{linky_oneline}</div>
          {linky_cheer && (
            <div className={styles.linkyCheerBox}>{linky_cheer}</div>
          )}
        </div>
      )}
    </div>
  )
}
