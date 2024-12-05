import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    userInfo: null,
    permissions: []
  }),

  actions: {
    // 用户登录
    async userLogin(loginForm) {
      try {
        const response = await login(loginForm)
        this.token = response.token
        setToken(response.token)
        return response
      } catch (error) {
        throw error
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const response = await getUserInfo()
        this.userInfo = response.user
        this.permissions = response.permissions || []
        return response
      } catch (error) {
        throw error
      }
    },

    // 用户登出
    async userLogout() {
      try {
        await logout()
        this.token = null
        this.userInfo = null
        this.permissions = []
        removeToken()
      } catch (error) {
        throw error
      }
    },

    // 检查是否有权限
    hasPermission(permission) {
      return this.permissions.includes(permission)
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
        paths: ['token', 'userInfo']
      }
    ]
  }
})
