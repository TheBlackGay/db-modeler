import { useUserStore } from '@/stores/user'

export default {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()

    if (value) {
      const hasPermission = Array.isArray(value) 
        ? value.some(permission => userStore.hasPermission(permission))
        : userStore.hasPermission(value)

      if (!hasPermission) {
        el.style.display = 'none'
      }
    }
  }
}
