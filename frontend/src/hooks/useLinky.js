import { useState } from 'react'
import { getLinkyComment } from '../api/linkyApi'

export function useLinky() {
  const [linky, setLinky] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchLinky = async (diaryId) => {
    setLoading(true)
    try {
      const data = await getLinkyComment(diaryId)
      setLinky(data.data)
    } finally {
      setLoading(false)
    }
  }

  return { linky, loading, fetchLinky }
}
