import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPhotobook, orderPhotobook } from '../api/photobookApi'
import styles from '../styles/PhotobookOrderPage.module.css'

const PERIODS = [
  { label: '최신 24개', value: 'latest' },
  { label: '직접 선택', value: 'custom' },
]

export default function PhotobookOrderPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const [period, setPeriod] = useState('latest')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [creatingBook, setCreatingBook] = useState(false)

  const [bookUid, setBookUid] = useState(null)
  const [bookTitle, setBookTitle] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [estimate, setEstimate] = useState(null)
  const [usedDefaultCover, setUsedDefaultCover] = useState(false)

  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [memo, setMemo] = useState('')
  const [ordering, setOrdering] = useState(false)

  const [ordered, setOrdered] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  const handleCreateBook = async () => {
    if (period === 'custom' && (!customStart || !customEnd)) {
      return alert('시작일과 종료일을 선택해주세요.')
    }
    setCreatingBook(true)
    const payload = period === 'latest'
      ? { limit: 24 }
      : { startDate: customStart, endDate: customEnd }
    try {
      const res = await createPhotobook(payload)
      const { book_uid, title, page_count, estimate, used_default_cover } = res.data
      setBookUid(book_uid)
      setBookTitle(title)
      setPageCount(page_count)
      setEstimate(estimate)
      setUsedDefaultCover(used_default_cover)
      setStep(2)
    } catch (err) {
      const status = err?.response?.status
      if (status === 404) {
        alert('선택한 기간에 일기가 없습니다.')
      } else if (status === 402) {
        alert('크레딧이 부족합니다.')
      } else {
        alert('포토북 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setCreatingBook(false)
    }
  }

  const handleOrder = async () => {
    if (!recipientName || !recipientPhone || !postalCode || !address1) {
      return alert('배송 정보를 모두 입력해주세요.')
    }
    setOrdering(true)
    try {
      const res = await orderPhotobook({
        bookId: bookUid,
        recipientName,
        recipientPhone,
        postalCode,
        address1,
        address2,
        memo,
      })
      setOrderResult(res.data)
      setOrdered(true)
    } catch (err) {
      const status = err?.response?.status
      if (status === 402) {
        alert('크레딧이 부족합니다.')
      } else {
        alert('주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setOrdering(false)
    }
  }

  if (ordered) {
    return (
      <div className={styles.page}>
        <div className={styles.successBox}>
          <div className={styles.successEmoji}>📬</div>
          <div className={styles.successTitle}>주문이 완료됐어요!</div>
          <div className={styles.successSub}>
            링키와의 소중한 이야기가<br />
            곧 당신에게 배달될 거예요 💚<br /><br />
            결제 금액: {orderResult?.paid_amount?.toLocaleString()}원<br />
            배송까지 5~7일 소요됩니다.
          </div>
          <button className={`${styles.orderBtn} ${styles.successBackBtn}`} onClick={() => navigate('/')}>
            홈으로 돌아가기 🌱
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => step === 2 ? setStep(1) : navigate('/')}>←</button>
          <span className={styles.headerTitle}>포토북 만들기</span>
        </div>

        {step === 1 && (
          <>
            <div className={styles.linkyBox}>
              <div className={styles.linkyAvatar}>🌱</div>
              <div className={styles.linkyBubble}>
                당신의 이야기를 책으로 만들어줄게요.<br />
                최소 24일치 일기가 필요해요 🍀
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>기간 선택</div>
              <div className={styles.periodRow}>
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    className={`${styles.periodBtn}${period === p.value ? ` ${styles.periodBtnActive}` : ''}`}
                    onClick={() => setPeriod(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {period === 'custom' && (
                <div className={styles.customDateRow}>
                  <input
                    type="date" className={styles.input}
                    value={customStart} onChange={e => setCustomStart(e.target.value)}
                  />
                  <span>~</span>
                  <input
                    type="date" className={styles.input}
                    value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className={styles.noticeBox}>
              🌿 Sandbox 환경에서는 실제 인쇄·배송이 이루어지지 않아요.<br />
              테스트 주문으로 전체 흐름을 확인할 수 있어요.
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {usedDefaultCover && (
              <div className={styles.defaultCoverNotice}>
                🖼️ 기본 표지를 사용했습니다.
              </div>
            )}

            <div className={styles.section}>
              <div className={styles.previewBox}>
                <div className={styles.previewEmoji}>📖</div>
                <div className={styles.previewTitle}>{bookTitle}</div>
                <div className={styles.previewSub}>{pageCount}페이지</div>
                {estimate && (
                  <div className={styles.estimateBox}>
                    <div>결제 금액: <strong>{estimate.paidCreditAmount.toLocaleString()}원</strong> (VAT 포함)</div>
                    <div>배송비 {estimate.shippingFee.toLocaleString()}원 포함</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>배송 정보</div>
              <input className={styles.input} placeholder="받으시는 분 이름"
                value={recipientName} onChange={e => setRecipientName(e.target.value)} />
              <input className={styles.input} placeholder="연락처 (010-0000-0000)"
                value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} />
              <input className={styles.input} placeholder="우편번호"
                value={postalCode} onChange={e => setPostalCode(e.target.value)} />
              <input className={styles.input} placeholder="주소"
                value={address1} onChange={e => setAddress1(e.target.value)} />
              <input className={styles.input} placeholder="상세 주소 (선택)"
                value={address2} onChange={e => setAddress2(e.target.value)} />
              <input className={styles.input} placeholder="배송 메모 (선택)"
                value={memo} onChange={e => setMemo(e.target.value)} />
            </div>
          </>
        )}
      </div>

      <div className={styles.bottomBar}>
        {step === 1 && (
          <button
            className={`${styles.orderBtn}${creatingBook ? ` ${styles.orderBtnLoading}` : ''}`}
            onClick={handleCreateBook}
            disabled={creatingBook}
          >
            {creatingBook ? '링키가 책을 만들고 있어요... 🌱' : '📖 책 만들기'}
          </button>
        )}
        {step === 2 && (
          <button
            className={`${styles.orderBtn}${ordering ? ` ${styles.orderBtnLoading}` : ''}`}
            onClick={handleOrder}
            disabled={ordering}
          >
            {ordering ? '주문 처리 중... 🌱' : '📬 주문하기'}
          </button>
        )}
      </div>
    </>
  )
}
