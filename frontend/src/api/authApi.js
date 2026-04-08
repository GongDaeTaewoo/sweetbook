import healingStoryClient from './client'

export const emailLogin = async (email) => {
  const loginResponse = await healingStoryClient.post('/auth/login', { email })
  return loginResponse.data
}

export const getMe = async () => {
  const meResponse = await healingStoryClient.get('/auth/me')
  return meResponse.data
}

export const logout = async () => {
  await healingStoryClient.post('/auth/logout')
}
