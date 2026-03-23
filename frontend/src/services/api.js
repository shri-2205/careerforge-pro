import axios from 'axios'

// Single axios instance — all requests go through here
const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
})

// Auto-attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// Resume
export const getResumes = () => api.get('/resume')
export const getResume = (id) => api.get(`/resume/${id}`)
export const uploadResumeFile = (file, title) => {
  const fd = new FormData()
  fd.append('resume', file)
  if (title) fd.append('title', title)
  return api.post('/resume/upload', fd)
}
export const submitResumeText = (content, title) => api.post('/resume/text', { content, title })
export const updateResume = (id, data) => api.put(`/resume/${id}`, data)
export const deleteResume = (id) => api.delete(`/resume/${id}`)

// Analysis
export const optimizeResume = (id, jobDescription) =>
  api.post(`/analysis/optimize/${id}`, { jobDescription })

export default api
