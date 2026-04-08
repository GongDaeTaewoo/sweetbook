import healingStoryClient from './client'

export const createDiary = async (formData) => {
  const diaryResponse = await healingStoryClient.post('/diaries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return diaryResponse.data
}

export const getDiaries = async ({ year, month } = {}) => {
  const diariesResponse = await healingStoryClient.get('/diaries', { params: { year, month } })
  return diariesResponse.data
}

export const getDiary = async (id) => {
  const diaryResponse = await healingStoryClient.get(`/diaries/${id}`)
  return diaryResponse.data
}

export const getWeeklyReview = async () => {
  const weeklyResponse = await healingStoryClient.get('/diaries/review/weekly')
  return weeklyResponse.data
}

export const getMonthlyReview = async () => {
  const monthlyResponse = await healingStoryClient.get('/diaries/review/monthly')
  return monthlyResponse.data
}
