import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DiaryCard from '../components/DiaryCard'
import LinkyWeeklyReview from '../components/LinkyWeeklyReview'
import LinkyMonthlyReview from '../components/LinkyMonthlyReview'
import PhotobookBanner from '../components/PhotobookBanner'
import { useUserStore } from '../store/userStore'
import { useDiaryList, useWeeklyReview, useMonthlyReview } from '../hooks/useDiary'
import styles from '../styles/DiaryListPage.module.css'

const MOOD_EMOJI = { 1: '😔', 2: '😟', 3: '😐', 4: '🙂', 5: '😊' }
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

function buildCalendar(year, month, diaries) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const diaryMap = {}
  diaries.forEach(d => {
    const day = parseInt(d.written_at.split('-')[2])
    if (!isNaN(day)) diaryMap[day] = d
  })
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, diary: diaryMap[d] || null })
  return cells
}

export default function DiaryListPage() {
  const navigate = useNavigate()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const { diaries, loading } = useDiaryList({ year, month: month + 1 })

  const weeklyReview = useWeeklyReview()
  const monthlyReview = useMonthlyReview()

  const cells = buildCalendar(year, month, diaries)

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  return (
    <>
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            <span className={styles.logoEmoji}>🌱</span>
            <span className={styles.logoText}>나의 치유 이야기</span>
          </div>
          <button className={styles.writeBtn} onClick={() => navigate('/diary/write')}>
            오늘 일기 쓰기
          </button>
        </div>

        <div className={styles.calendar}>
          <div className={styles.calHeader}>
            <span className={styles.calTitle}>{year}년 {MONTHS[month]}</span>
            <div className={styles.calNav}>
              <button className={styles.calNavBtn} onClick={prevMonth}>‹</button>
              <button className={styles.calNavBtn} onClick={nextMonth}>›</button>
            </div>
          </div>
          <div className={styles.calGrid}>
            {['일','월','화','수','목','금','토'].map(d => (
              <div key={d} className={styles.calDay}>{d}</div>
            ))}
            {cells.map((cell, i) => {
              const dateStr = cell
                ? `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
                : null
              return (
                <div
                  key={i}
                  className={cell
                    ? `${styles.calCell}${cell.diary ? ` ${styles.calCellWithDiary}` : ''}`
                    : styles.calCellEmpty
                  }
                  onClick={cell ? () => navigate(`/diary/write?date=${dateStr}`) : undefined}
                  style={cell ? { cursor: 'pointer' } : undefined}
                >
                  {cell && <>
                    <div className={styles.calDate}>{cell.day}</div>
                    {cell.diary && <div className={styles.calEmoji}>{MOOD_EMOJI[cell.diary.mood]}</div>}
                  </>}
                </div>
              )
            })}
          </div>
        </div>

        {weeklyReview && <LinkyWeeklyReview review={weeklyReview} />}
        {monthlyReview && <LinkyMonthlyReview review={monthlyReview} />}
        {diaries.length >= 24 && <PhotobookBanner type={monthlyReview ? 'monthly' : 'weekly'} />}

        <div className={styles.sectionTitle}>최근 일기</div>

        {diaries.length === 0 && !loading ? (
          <div className={styles.empty}>
            아직 일기가 없어요 🌿<br />
            오늘 첫 번째 이야기를 써볼까요?
          </div>
        ) : (
          diaries.map(d => <DiaryCard key={d.id} diary={d} />)
        )}
      </div>
    </>
  )
}
