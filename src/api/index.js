import axios from "axios";


const url = 'http://193.176.78.237:8080/api'


const loginConfig = {
    baseURL: url,
    headers: {
        'Content-Type' : 'application/json'
    }
}
export const LoginAPIInstance = axios.create(loginConfig)


const defaultConfig = {
    baseURL: url,
    headers: {
        'Content-Type' : 'application/json'
    }
}
const token = localStorage.getItem('token')
if (token) defaultConfig.headers['authorization'] = `Bearer ${token}`

export const DefaultAPIInstance = axios.create(defaultConfig)

DefaultAPIInstance.interceptors.request.use(
    config => {
        if(!localStorage.getItem('token')) {
            delete config.headers['authorization']
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

DefaultAPIInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('userName')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userRoles')
            location.reload()
        }
        return Promise.reject(error)
    }
)