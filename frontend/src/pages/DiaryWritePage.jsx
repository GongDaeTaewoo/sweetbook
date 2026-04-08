import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MoodPicker from '../components/MoodPicker'
import LinkyMessage from '../components/LinkyMessage'
import PhotoUploader from '../components/PhotoUploader'
import { createDiary } from '../api/diaryApi'
import { useLinky } from '../hooks/useLinky'
import styles from '../styles/DiaryWritePage.module.css'

const GREETINGS = {
  1: '힘든 날에도 여기 와줘서 고마워요 🌿\n천천히 써도 괜찮아요.',
  2: '오늘 많이 힘들었군요.\n그래도 링키한테 말해줘서 기뻐요 💚',
  3: '그냥 그런 날도 있어요.\n오늘 있었던 일 들려줄래요? 🍀',
  4: '오, 나쁘지 않은 하루였나봐요!\n링키도 기분이 좋아지네요 🌱',
  5: '좋은 하루였군요!\n어떤 일이 있었는지 궁금해요 ✨',
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

export default function DiaryWritePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const [mood, setMood] = useState(null)
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState([])
  const [saved, setSaved] = useState(false)
  const { linky, loading: linkyLoading, fetchLinky } = useLinky()

  const greetingText = mood
    ? GREETINGS[mood.value]
    : '오늘 하루 어땠어요?\n링키가 들을게요 🍀'

  const handleSave = async () => {
    if (saved) return
    if (!mood && !content.trim()) return alert('기분이나 일기를 입력해주세요.')

    setSaved(true)

    const formData = new FormData()
    formData.append('mood', mood.value)
    formData.append('content', content)
    formData.append('written_at', selectedDate)
    photos.forEach(p => formData.append('photos', p.file))

    try {
      const diaryResult = await createDiary(formData)
      const diaryId = diaryResult.data.id
      await fetchLinky(diaryId)
      document.getElementById('linky-response')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch (err) {
      const status = err?.response?.status
      if (status === 409) {
        alert('해당 날짜에 이미 일기가 있습니다.')
      } else {
        alert('저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
      setSaved(false)
    }
  }

  return (
    <>
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>
          <span className={styles.dateText}>{formatDate(selectedDate)}</span>
          <button className={styles.saveTopBtn} onClick={handleSave}>저장</button>
        </div>

        <div className={styles.greeting}>
          <LinkyMessage text={greetingText} loading={false} />
        </div>

        <div className={styles.section} style={{ animationDelay: '0.05s' }}>
          <div className={styles.sectionLabel}>지금 기분이 어때요?</div>
          <MoodPicker value={mood?.value} onChange={setMood} />
        </div>

        <div className={styles.section} style={{ animationDelay: '0.10s' }}>
          <div className={styles.sectionLabel}>오늘 있었던 일을 자유롭게 써봐요</div>
          <textarea
            className={styles.textarea}
            placeholder="아무 말이나 괜찮아요. 링키는 판단하지 않아요 🌿"
            maxLength={1000}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className={styles.charCount}>{content.length} / 1000</div>
        </div>

        <div className={styles.section} style={{ animationDelay: '0.15s' }}>
          <div className={styles.sectionLabel}>오늘의 사진 (선택)</div>
          <PhotoUploader files={photos} onChange={setPhotos} />
        </div>

        {(linkyLoading || linky) && (
          <div id="linky-response" className={styles.linkyResponse}>
            <div className={styles.linkyResponseTitle}>🌱 링키의 오늘</div>
            {linkyLoading ? (
              <LinkyMessage text="" loading={true} />
            ) : (
              <>
                <div className={styles.linkyOneline}>{linky?.oneline}</div>
                <div className={styles.linkyCheerLabel}>링키의 격려</div>
                <div className={styles.linkyCheer}>{linky?.cheer}</div>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.bottomBar}>
        <button
          className={`${styles.saveBtn}${saved ? ` ${styles.saveBtnSaved}` : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ 저장 완료' : '🍀 링키에게 전달하기'}
        </button>
      </div>
    </>
  )
}
