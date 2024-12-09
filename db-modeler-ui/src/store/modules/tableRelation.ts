import { defineStore } from 'pinia'
import type { TableRelation } from '@/types/tableRelation'
import * as tableRelationApi from '@/api/tableRelation'

export const useTableRelationStore = defineStore('tableRelation', {
  state: () => ({
    relations: [] as TableRelation[],
    loading: false,
    currentRelation: null as TableRelation | null
  }),

  actions: {
    async getProjectRelations(projectId: string) {
      this.loading = true
      try {
        const data = await tableRelationApi.getProjectRelations(projectId)
        this.relations = data
      } finally {
        this.loading = false
      }
    },

    async createRelation(projectId: string, data: any) {
      const relation = await tableRelationApi.createRelation(projectId, data)
      this.relations.push(relation)
      return relation
    },

    async updateRelation(relationId: string, data: any) {
      const relation = await tableRelationApi.updateRelation(relationId, data)
      const index = this.relations.findIndex(r => r.id === relationId)
      if (index !== -1) {
        this.relations[index] = relation
      }
      return relation
    },

    async deleteRelation(relationId: string) {
      await tableRelationApi.deleteRelation(relationId)
      const index = this.relations.findIndex(r => r.id === relationId)
      if (index !== -1) {
        this.relations.splice(index, 1)
      }
    },

    setCurrentRelation(relation: TableRelation | null) {
      this.currentRelation = relation
    }
  }
})
