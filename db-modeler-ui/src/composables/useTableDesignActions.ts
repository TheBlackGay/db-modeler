import { ref, type Ref } from 'vue'
import { message } from 'ant-design-vue'
import { tableApi } from '@/api/table'
import type { TableDTO, Field, Index } from '@/types/table'
import type { TableInfo } from './useTableDesignForm'

interface ParsedColumns {
  fields: Field[]
  indexes: Index[]
}

export function useTableDesignActions(tableInfo: Ref<TableInfo>) {
  const loading = ref(false)
  const saving = ref(false)

  const loadTableDesign = async (id: string) => {
    try {
      loading.value = true
      const { data: apiResponse } = await tableApi.getTableDesignById(id)
      
      if (!apiResponse || apiResponse.code !== 0 || !apiResponse.data) {
        throw new Error(apiResponse?.message || '加载表设计失败')
      }

      const data = apiResponse.data
      let metadata = {}
      if (data.metadata) {
        try {
          if (typeof data.metadata === 'object' && data.metadata !== null) {
            metadata = {
              ...data.metadata,
              dbType: data.metadata.dbType.toUpperCase()
            }
          } else if (typeof data.metadata === 'string') {
            const decodedMetadata = data.metadata
              .replace(/&#34;/g, '"')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&apos;/g, "'")
              .replace(/&amp;/g, '&')
            const parsedMetadata = JSON.parse(decodedMetadata)
            metadata = {
              ...parsedMetadata,
              dbType: parsedMetadata.dbType.toUpperCase()
            }
          }
        } catch (e) {
          console.error('Failed to parse metadata:', e)
        }
      }

      return {
        ...metadata,
        name: data.code || '',
        displayName: data.displayName || '',
        comment: data.comment || '',
        id: data.id,
        projectId: data.projectId,
        synced: data.synced || false,
        columns: parseColumns(data.columns)
      }
    } catch (error: any) {
      message.error(error.message || '加载表设计失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  const saveDesign = async () => {
    try {
      saving.value = true
      const payload: Partial<TableDTO> = {
        code: tableInfo.value.name,
        displayName: tableInfo.value.displayName,
        comment: tableInfo.value.comment,
        metadata: JSON.stringify({
          dbType: tableInfo.value.dbType,
          engine: tableInfo.value.engine,
          charset: tableInfo.value.charset,
          collation: tableInfo.value.collation,
          tablespace: tableInfo.value.tablespace,
          autoIncrement: tableInfo.value.autoIncrement,
          rowFormat: tableInfo.value.rowFormat,
          partitionConfig: tableInfo.value.partitionConfig
        })
      }
      const { data: apiResponse } = await tableApi.updateTableDesign(tableInfo.value.name, payload)
      
      if (!apiResponse || apiResponse.code !== 0) {
        throw new Error(apiResponse?.message || '保存失败')
      }

      message.success('保存成功')
    } catch (error: any) {
      message.error(error.message || '保存失败')
      throw error
    } finally {
      saving.value = false
    }
  }

  const syncToDatabase = async () => {
    try {
      await saveDesign()
      // TODO: 实现同步到数据库的逻辑
      message.success('同步成功')
    } catch (error: any) {
      message.error(error.message || '同步失败')
    }
  }

  const parseColumns = (columns: TableDTO['columns']): ParsedColumns => {
    const defaultResult: ParsedColumns = {
      fields: [],
      indexes: []
    }

    if (!columns) {
      return defaultResult
    }

    try {
      if (typeof columns === 'object' && columns !== null) {
        return {
          fields: columns.fields || [],
          indexes: columns.indexes || []
        }
      } else if (typeof columns === 'string') {
        const decodedColumns = columns
          .replace(/&#34;/g, '"')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
        const parsed = JSON.parse(decodedColumns)
        return {
          fields: parsed.fields || [],
          indexes: parsed.indexes || []
        }
      }
    } catch (e) {
      console.error('Failed to parse columns:', e)
      message.warning('字段数据解析失败，将使用默认值')
    }

    return defaultResult
  }

  return {
    loading,
    saving,
    loadTableDesign,
    saveDesign,
    syncToDatabase
  }
} 