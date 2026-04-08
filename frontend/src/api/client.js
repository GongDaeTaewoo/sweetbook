import axios from 'axios'

const healingStoryClient = axios.create({ baseURL: '/api' })

healingStoryClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default healingStoryClient
