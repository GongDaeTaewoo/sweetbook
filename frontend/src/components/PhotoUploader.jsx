import { useRef } from 'react'
import styles from '../styles/PhotoUploader.module.css'

export default function PhotoUploader({ files, onChange }) {
  const inputRef = useRef()

  const handleAdd = (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
    }))
    onChange([...files, ...newFiles])
    e.target.value = ''
  }

  const handleRemove = (idx) => {
    const next = files.filter((_, i) => i !== idx)
    onChange(next)
  }

  return (
    <div className={styles.area}>
      {files.map((f, i) => (
        <div key={i} className={styles.preview}>
          <img src={f.preview} alt="" className={styles.img} />
          <button className={styles.removeBtn} onClick={() => handleRemove(i)}>✕</button>
        </div>
      ))}
      {files.length < 5 && (
        <div className={styles.addBtn} onClick={() => inputRef.current.click()}>
          <span className={styles.addBtnIcon}>📷</span>
          <span className={styles.addBtnText}>사진 추가</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleAdd} className={styles.fileInput} />
    </div>
  )
}
