import { DefaultAPIInstance } from "@/api"
import {AuthAPI} from "@/api/Auth"

export const AuthModule = {
    namespaced: true,

    state() {
        return {
            credentials: {
                token: localStorage.getItem('token') || null,
                userId: localStorage.getItem('userId') || null,
                userName: localStorage.getItem('userName') || null,                
                userEmail: localStorage.getItem('userEmail') || null,
                userRoles: localStorage.getItem('userRoles') || null,
            }
        }
    },
    
    getters: {
        getUserId: (state) => state.credentials.userId,
        getUserName: (state) => state.credentials.userName,
        getUserRoles: (state) => state.credentials.userRoles
    },

    mutations: {
        setToken(state, token) {
            state.credentials.token = token
            localStorage.setItem('token', token)
        },

        setUserId(state, userId) {
            state.credentials.userId = userId
            localStorage.setItem('userId', userId)
        },

        setUserName(state, userName) {
            state.credentials.userName = userName
            localStorage.setItem('userName', userName)
        },

        setUserEmail(state, userEmail) {
            state.credentials.userEmail = userEmail
            localStorage.setItem('userEmail', userEmail)
        },

        setUserRoles(state, userRoles) {
            state.credentials.userRoles = userRoles
            localStorage.setItem('userRoles', userRoles)
        },

        deleteToken(state) {
            state.credentials.token = null
            localStorage.removeItem('token')
        },
        
        deleteUserName(state) {
            state.credentials.userName = null
            localStorage.removeItem('userName')
        },
        
        deleteUserEmail(state) {
            state.credentials.userEmail = null
            localStorage.removeItem('userEmail')
        },

        deleteUserId(state) {
            state.credentials.userId = null
            localStorage.removeItem('userId')
        },
        
        deleteUserRoles(state) {
            state.credentials.userRoles = null
            localStorage.removeItem('userRoles')
        }
    },

    actions: {
        onLogin({commit}, {email, password}) {
            return AuthAPI.login(email, password).then((res) => {
                commit('setToken', res.data.token)
                commit('setUserId', res.data.id)
                commit('setUserName', res.data.username)
                commit('setUserEmail', res.data.email)
                commit('setUserRoles', res.data.roles.join(', '))
                DefaultAPIInstance.defaults.headers['authorization'] = `Bearer ${res.data.token}`
            })
        },
        
        onLogout({commit}) {
            commit('deleteToken')
            commit('deleteUserId')
            commit('deleteUserName')
            commit('deleteUserEmail')
            commit('deleteUserRoles')
            delete DefaultAPIInstance.defaults.headers['authorization']
        }
    }
}