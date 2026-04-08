import healingStoryClient from './client'

export const getLinkyComment = async (diaryId) => {
  const linkyResponse = await healingStoryClient.post(`/linky/comment/${diaryId}`)
  return linkyResponse.data
}
