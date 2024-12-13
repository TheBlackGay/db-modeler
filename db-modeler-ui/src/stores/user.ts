import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref<string>('')
  const userInfo = ref<{
    id: string
    username: string
    tenantId?: string
  } | null>(null)

  // 设置 token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 获取 token
  function getToken(): string {
    if (!token.value) {
      token.value = localStorage.getItem('token') || ''
    }
    return token.value
  }

  // 设置用户信息
  function setUserInfo(info: typeof userInfo.value) {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
  }

  // 获取用户信息
  function getUserInfo() {
    if (!userInfo.value) {
      const storedInfo = localStorage.getItem('userInfo')
      if (storedInfo) {
        userInfo.value = JSON.parse(storedInfo)
      }
    }
    return userInfo.value
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  return {
    token,
    userInfo,
    setToken,
    getToken,
    setUserInfo,
    getUserInfo,
    logout
  }
}) 