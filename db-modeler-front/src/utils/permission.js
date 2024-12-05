import { useUserStore } from '@/stores/user'

// 检查是否有权限
export function checkPermission(permission) {
  const userStore = useUserStore()
  return userStore.hasPermission(permission)
}

// 过滤有权限的路由
export function filterRoutesByPermission(routes) {
  const userStore = useUserStore()

  return routes.filter(route => {
    if (route.meta?.permissions) {
      return route.meta.permissions.some(permission => 
        userStore.hasPermission(permission)
      )
    }
    return true
  }).map(route => {
    if (route.children) {
      route.children = filterRoutesByPermission(route.children)
    }
    return route
  })
}

// 检查操作权限
export function checkActionPermission(action, resourceType) {
  const userStore = useUserStore()
  const permission = `${resourceType}:${action}`
  return userStore.hasPermission(permission)
}
