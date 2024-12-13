import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { tableApi } from '@/api/table'
import { TableType, TableDomain, TableStatus } from '@/types/table'
import type { Table } from '@/types/table'

export function useTableDesign(tableId?: string) {
  // 状态管理
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<Error | null>(null)
  const initialized = ref(false)
  
  const table = ref<Table>({
    id: tableId || '',
    code: '',
    displayName: '',
    comment: '',
    type: TableType.TABLE,
    domain: TableDomain.BUSINESS,
    columns: {
      fields: [],
      indexes: []
    },
    metadata: {
      dbType: 'MYSQL',
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      tablespace: '',
      autoIncrement: 1,
      rowFormat: 'DEFAULT'
    },
    status: TableStatus.DRAFT,
    synced: false
  })
  
  // 加载表设计
  const loadTableDesign = async () => {
    if (!tableId) {
      initialized.value = true
      return
    }
    
    try {
      loading.value = true
      error.value = null
      
      console.log('Loading table design with ID:', tableId)
      const response = await tableApi.getTableDesignById(tableId)
      console.log('Raw API Response:', response)
      
      if (response && response.data) {
        const data = response.data
        console.log('Table Design Data:', data)
        
        // 确保数据结构完整
        table.value = {
          ...data,
          columns: data.columns || { fields: [], indexes: [] },
          metadata: data.metadata || {
            dbType: 'MYSQL',
            engine: 'InnoDB',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tablespace: '',
            autoIncrement: 1,
            rowFormat: 'DEFAULT'
          }
        }
        
        console.log('Updated table data:', table.value)
      } else {
        throw new Error('无效的响应数据')
      }
    } catch (err: any) {
      console.error('Failed to load table design:', err)
      error.value = err
      message.error(err.message || '加载表设计失败')
      throw err
    } finally {
      loading.value = false
      initialized.value = true
    }
  }
  
  // 保存表设计
  const saveTableDesign = async () => {
    if (!tableId || !initialized.value) return
    
    try {
      saving.value = true
      error.value = null
      
      // 验证必填字段
      if (!table.value.displayName?.trim()) {
        throw new Error('表显示名称不能为空')
      }
      
      // 直接使用当前的数据结构
      const response = await tableApi.updateTableDesign(tableId, table.value)
      
      if (response.code === 0) {
        message.success('保存成功')
      } else {
        throw new Error(response.message || '保存失败')
      }
    } catch (err: any) {
      console.error('Failed to save table design:', err)
      error.value = err
      message.error(err.message || '保存失败')
      throw err
    } finally {
      saving.value = false
    }
  }
  
  // 同步到数据库
  const syncToDatabase = async () => {
    if (!tableId || !initialized.value) return
    
    try {
      saving.value = true
      error.value = null
      
      const response = await tableApi.syncTableDesign(tableId)
      
      if (response.code === 0) {
        table.value.synced = true
        message.success('同步成功')
      } else {
        throw new Error(response.message || '同步失败')
      }
    } catch (err: any) {
      console.error('Failed to sync table:', err)
      error.value = err
      throw err
    } finally {
      saving.value = false
    }
  }
  
  return {
    // 状态
    loading,
    saving,
    error,
    initialized,
    
    // 数据
    table,
    
    // 方法
    loadTableDesign,
    saveTableDesign,
    syncToDatabase
  }
}

export default useTableDesign