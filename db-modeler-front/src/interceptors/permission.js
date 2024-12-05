import router from '@/router'
import { useUserStore } from '@/stores/user'
import { filterRoutesByPermission } from '@/utils/permission'

export function setupPermissionInterceptor() {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // 检查是否登录
    if (!userStore.token) {
      // 未登录，重定向到登录页
      if (to.path !== '/login') {
        next('/login')
        return
      }
      next()
      return
    }

    // 获取用户信息和权限
    if (!userStore.userInfo) {
      try {
        await userStore.fetchUserInfo()
      } catch (error) {
        // 获取用户信息失败，退出登录
        userStore.userLogout()
        next('/login')
        return
      }
    }

    // 权限过滤
    const accessRoutes = filterRoutesByPermission(router.getRoutes())
    accessRoutes.forEach(route => {
      if (!router.hasRoute(route.name)) {
        router.addRoute(route)
      }
    })

    // 检查路由权限
    if (to.meta.permissions) {
      const hasPermission = to.meta.permissions.some(permission => 
        userStore.hasPermission(permission)
      )

      if (!hasPermission) {
        next('/403')
        return
      }
    }

    next()
  })
}
