import styles from '../styles/MoodPicker.module.css'

const MOODS = [
  { emoji: '😔', label: '매우\n힘들어요', value: 1 },
  { emoji: '😟', label: '힘들어요',     value: 2 },
  { emoji: '😐', label: '그냥\n그래요', value: 3 },
  { emoji: '🙂', label: '괜찮아요',     value: 4 },
  { emoji: '😊', label: '좋아요',       value: 5 },
]

export default function MoodPicker({ value, onChange }) {
  return (
    <div className={styles.row}>
      {MOODS.map(m => (
        <button
          key={m.value}
          className={`${styles.btn}${value === m.value ? ` ${styles.btnActive}` : ''}`}
          onClick={() => onChange(m)}
        >
          <span className={styles.emoji}>{m.emoji}</span>
          <span className={`${styles.label}${value === m.value ? ` ${styles.labelActive}` : ''}`}>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
