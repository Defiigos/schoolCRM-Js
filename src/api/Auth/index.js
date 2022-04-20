import {LoginAPIInstance} from "@/api"

export const AuthAPI = {
    login(email, password) {
         const url = 'auth/login'
         const data = {email, password}
         return LoginAPIInstance.post(url, data)
    }
}