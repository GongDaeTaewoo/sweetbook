import styles from '../styles/LinkyMessage.module.css'

export default function LinkyMessage({ text, loading }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>🌱</div>
      <div className={styles.bubble}>
        {loading
          ? <span className={styles.loading}>링키가 읽고 있어요... 🌿</span>
          : <span dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
        }
      </div>
    </div>
  )
}
