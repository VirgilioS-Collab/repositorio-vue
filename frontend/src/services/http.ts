import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:5000/api
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})

// Interceptores (token JWT, errores, etc.)
http.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt')
    if (token) config.headers!['Authorization'] = `Bearer ${token}`
    return config
})

export default http
