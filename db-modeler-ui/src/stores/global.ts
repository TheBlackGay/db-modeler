import { defineStore } from 'pinia'
import type { Tenant } from '../api/tenant'

interface GlobalState {
  currentTenant: Tenant | null
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    currentTenant: null
  }),
  
  actions: {
    setCurrentTenant(tenant: Tenant | null) {
      this.currentTenant = tenant
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'global-store',
        storage: localStorage
      }
    ]
  }
})
