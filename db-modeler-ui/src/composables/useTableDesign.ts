import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { TableInfo } from '@/views/design/model/types'
import { projectApi } from '@/api/project'
import { useGlobalStore } from '@/stores/global'

export function useTableDesign(projectId: string) {
  const router = useRouter()
  const route = useRoute()
  const globalStore = useGlobalStore()
  const isComponentMounted = ref(false)

  // 基础状态
  const loading = ref(false)
  const tableList = ref<TableInfo[]>([])
  const tables = ref<TableInfo[]>([])
  const activeTable = ref<TableInfo | null>(null)

  // 画布状态
  const scale = ref(1)
  const viewportX = ref(0)
  const viewportY = ref(0)
  const tablePositions = ref<Record<string, { x: number; y: number }>>({})

  // 历史记录状态和管理
  const history = ref<{
    tables: TableInfo[]
    positions: Record<string, { x: number; y: number }>
  }[]>([])
  const historyIndex = ref(-1)
  const isHistoryUpdating = ref(false)

  // 变更跟踪状态
  const originalState = ref<{
    tables: TableInfo[]
    positions: Record<string, { x: number; y: number }>
  } | null>(null)

  // 右侧面板数据
  const selectedTableData = ref<TableInfo & { position: { x: number, y: number } } | null>(null)

  // 表单状态
  const createForm = ref<Partial<TableInfo>>({
    code: '',
    displayName: '',
    comment: '',
    type: 'TABLE',
    domain: 'BUSINESS',
    projectId
  })

  // 其他状态
  const createLoading = ref(false)
  const previewVisible = ref(false)
  const ddlContent = ref('')

  // 表单验证规则
  const rules = {
    code: [{ required: true, message: '请输入表代码' }],
    displayName: [{ required: true, message: '请输入表名' }]
  }

  // 计算属性
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // 检查是否有实际变更
  const hasActualChanges = computed(() => {
    if (!originalState.value || isHistoryUpdating.value) return false
    
    try {
      // 检查表格数量是否变化
      if (tables.value.length !== originalState.value.tables.length) return true
      
      // 检查表格内容是否变化
      for (const table of tables.value) {
        const originalTable = originalState.value.tables.find(t => t.id === table.id)
        if (!originalTable) return true
        
        // 比较表格属性
        if (
          table.code !== originalTable.code ||
          table.displayName !== originalTable.displayName ||
          table.comment !== originalTable.comment ||
          table.type !== originalTable.type ||
          table.domain !== originalTable.domain
        ) return true
      }
      
      // 检查位置是否变化
      for (const [id, pos] of Object.entries(tablePositions.value)) {
        const originalPos = originalState.value.positions[id]
        if (!originalPos) return true
        if (pos.x !== originalPos.x || pos.y !== originalPos.y) return true
      }
      
      return false
    } catch (error) {
      console.error('Error in hasActualChanges computed:', error)
      return false
    }
  })

  // 保存当前状态
  const saveCurrentState = () => {
    try {
      originalState.value = {
        tables: JSON.parse(JSON.stringify(tables.value)),
        positions: JSON.parse(JSON.stringify(tablePositions.value))
      }
      console.log('Saved current state')
    } catch (error) {
      console.error('Failed to save current state:', error)
    }
  }

  // 历史记录操作
  const addHistory = () => {
    try {
      if (isHistoryUpdating.value) return
      
      // 删除当前位置之后的历史记录
      if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1)
      }
      
      // 添加新的历史记录
      const newState = {
        tables: JSON.parse(JSON.stringify(tables.value)),
        positions: JSON.parse(JSON.stringify(tablePositions.value))
      }
      history.value.push(newState)
      historyIndex.value = history.value.length - 1
      console.log('Added history:', { index: historyIndex.value, total: history.value.length })
    } catch (error) {
      console.error('Failed to add history:', error)
    }
  }

  const restoreState = (state: typeof history.value[0]) => {
    try {
      isHistoryUpdating.value = true
      tables.value = JSON.parse(JSON.stringify(state.tables))
      tablePositions.value = JSON.parse(JSON.stringify(state.positions))
    } catch (error) {
      console.error('Failed to restore state:', error)
    } finally {
      isHistoryUpdating.value = false
    }
  }

  // 初始化历史记录
  const initHistory = () => {
    try {
      const initialState = {
        tables: JSON.parse(JSON.stringify(tables.value)),
        positions: JSON.parse(JSON.stringify(tablePositions.value))
      }
      history.value = [initialState]
      historyIndex.value = 0
      console.log('Initialized history')
    } catch (error) {
      console.error('Failed to initialize history:', error)
    }
  }

  // 撤销操作
  const handleUndo = () => {
    if (!canUndo.value) return
    try {
      historyIndex.value--
      const state = history.value[historyIndex.value]
      restoreState(state)
      console.log('Undo to:', { index: historyIndex.value, total: history.value.length })
    } catch (error) {
      console.error('Failed to undo:', error)
      message.error('撤销操作失败')
    }
  }

  // 重做操作
  const handleRedo = () => {
    if (!canRedo.value) return
    try {
      historyIndex.value++
      const state = history.value[historyIndex.value]
      restoreState(state)
      console.log('Redo to:', { index: historyIndex.value, total: history.value.length })
    } catch (error) {
      console.error('Failed to redo:', error)
      message.error('重做操作失败')
    }
  }

  // 画布操作
  const handleZoomIn = () => {
    if (scale.value < 3) {
      scale.value *= 1.2
    }
  }

  const handleZoomOut = () => {
    if (scale.value > 0.1) {
      scale.value *= 0.8
    }
  }

  const handleFitScreen = () => {
    scale.value = 1
    viewportX.value = 0
    viewportY.value = 0
  }

  // DDL 预览
  const handlePreviewDDL = async () => {
    if (!activeTable.value?.id) {
      message.error('请先选择表格')
      return
    }

    try {
      const response = await projectApi.getTableDesignById(activeTable.value.id)
      const responseData = response.data
      
      if (responseData.code === 0 && responseData.data) {
        ddlContent.value = generateDDL(responseData.data)
        previewVisible.value = true
      } else {
        throw new Error(responseData.message || '获取表格详情失败')
      }
    } catch (error: any) {
      console.error('获取表格详情失败:', error)
      message.error(error.message || '获取表格详情失败')
    }
  }

  const generateDDL = (table: TableInfo) => {
    // TODO: 实现DDL生成逻辑
    return ''
  }

  // 返回操作
  const handleBack = () => {
    if (history.value.length > 1) {
      Modal.confirm({
        title: '提示',
        content: '有未保存的更改，是否保存？',
        okText: '保存',
        cancelText: '不保存',
        async onOk() {
          try {
            await handleSave()
            router.push(`/projects/${projectId}`)
          } catch (error) {
            console.error('Failed to save before leaving:', error)
          }
        },
        onCancel() {
          router.push(`/projects/${projectId}`)
        }
      })
    } else {
      router.push(`/projects/${projectId}`)
    }
  }

  // 保存操作
  const handleSave = async () => {
    try {
      loading.value = true
      // 保存表格位置信息
      for (const table of tables.value) {
        if (!table.id) continue
        const position = tablePositions.value[table.id]
        if (position) {
          const response = await projectApi.updateTableDesign(table.id, {
            ...table,
            metadata: JSON.stringify({
              position,
              // 保留其他元数据
              ...JSON.parse(table.metadata || '{}')
            })
          })
          const responseData = response.data
          if (responseData.code === 0) {
            console.log('Saved table:', { id: table.id, position })
          } else {
            throw new Error(responseData.message || '保存失败')
          }
        }
      }
      
      message.success('保存成功')
      initHistory() // 重置历史记录
    } catch (error: any) {
      console.error('Failed to save:', error)
      message.error(error.message || '保存失败')
    } finally {
      loading.value = false
    }
  }

  // 表格操作
  const handleTableMove = (tableId: string, x: number, y: number) => {
    try {
      if (!tablePositions.value[tableId]) {
        console.warn('Table position not found:', tableId)
        return
      }
      tablePositions.value[tableId] = { x, y }
      console.log('Table moved:', { tableId, x, y })
    } catch (error) {
      console.error('Failed to move table:', error)
    }
  }

  const handleSelectTable = async (table: TableInfo) => {
    try {
      if (!table.id) return
      const response = await projectApi.getTableDesignById(table.id)
      const responseData = response.data
      if (responseData.code === 0 && responseData.data) {
        const tableData = responseData.data
        // 更新选中的表格
        activeTable.value = tableData
        
        // 更新表格列表
        const index = tables.value.findIndex(t => t.id === table.id)
        if (index > -1) {
          tables.value[index] = tableData
        } else {
          tables.value.push(tableData)
          // 设置初始位置
          if (!tablePositions.value[table.id]) {
            tablePositions.value[table.id] = {
              x: Math.random() * 500,
              y: Math.random() * 500
            }
          }
        }
        
        // 更新右侧面板数据
        selectedTableData.value = {
          ...tableData,
          position: tablePositions.value[table.id] || { x: 0, y: 0 }
        }
        
        console.log('Selected table:', tableData)
      } else {
        throw new Error(responseData.message || '获取表格详情失败')
      }
    } catch (error: any) {
      console.error('Failed to load table details:', error)
      message.error(error.message || '加载表格详情失败')
    }
  }

  // 处理表格位置变更
  const handlePositionChange = () => {
    if (!selectedTableData.value || !activeTable.value) return
    
    try {
      // 更新位置信息
      tablePositions.value[activeTable.value.id] = {
        x: selectedTableData.value.position.x,
        y: selectedTableData.value.position.y
      }
    } catch (error) {
      console.error('Failed to update table position:', error)
    }
  }

  // 处理表格更新
  const handleUpdateTable = async () => {
    if (!selectedTableData.value || !activeTable.value?.id) return
    
    try {
      loading.value = true
      const { position, ...tableData } = selectedTableData.value
      
      // 更新表格信息
      const response = await projectApi.updateTableDesign(activeTable.value.id, {
        ...tableData,
        metadata: JSON.stringify({
          position,
          // 保留其他元数据
          ...JSON.parse(tableData.metadata || '{}')
        })
      })
      
      const responseData = response.data
      if (responseData.code === 0) {
        message.success('保存成功')
        
        // 更新本地数据
        const index = tables.value.findIndex(t => t.id === activeTable.value?.id)
        if (index > -1) {
          tables.value[index] = {
            ...tableData,
            metadata: JSON.stringify({
              position,
              ...JSON.parse(tableData.metadata || '{}')
            })
          }
        }
        
        // 更新位置信息
        if (activeTable.value.id) {
          tablePositions.value[activeTable.value.id] = position
        }
        
        // 保存当前状态
        saveCurrentState()
      } else {
        throw new Error(responseData.message || '保存失败')
      }
    } catch (error: any) {
      console.error('Failed to update table:', error)
      message.error(error.message || '保存失败')
    } finally {
      loading.value = false
    }
  }

  // 处理表格重置
  const handleResetTable = () => {
    if (!activeTable.value || !selectedTableData.value) return
    
    try {
      // 重置为原始数据
      const originalTable = originalState.value?.tables.find(t => t.id === activeTable.value?.id)
      const originalPosition = originalState.value?.positions[activeTable.value.id]
      
      if (originalTable && originalPosition) {
        selectedTableData.value = {
          ...originalTable,
          position: originalPosition
        }
        
        // 更新位置信息
        tablePositions.value[activeTable.value.id] = originalPosition
      }
    } catch (error) {
      console.error('Failed to reset table:', error)
      message.error('重置失败')
    }
  }

  // 处理表格创建
  const handleCreate = async () => {
    if (!createForm.value.displayName || !createForm.value.code) {
      message.warning('请填写必要信息')
      return
    }
    
    createLoading.value = true
    try {
      const requestData = {
        ...createForm.value,
        projectId
      }
      
      const response = await projectApi.createTableDesign(requestData)
      const responseData = response.data
      if (responseData.code === 0 && responseData.data) {
        message.success('创建成功')
        
        // 重置表单
        createForm.value = {
          code: '',
          displayName: '',
          comment: '',
          type: 'TABLE',
          domain: 'BUSINESS',
          projectId
        }
        
        // 加载新创建的表
        await handleSelectTable(responseData.data)
        console.log('Created table:', responseData.data)
      } else {
        throw new Error(responseData.message || '创建失败')
      }
    } catch (error: any) {
      console.error('Failed to create table:', error)
      message.error(error.message || '创建失败')
    } finally {
      createLoading.value = false
    }
  }

  // API 相关函数
  const fetchTableList = async () => {
    loading.value = true
    try {
      const response = await projectApi.getTableDesigns(projectId)
      const responseData = response.data
      
      if (responseData.code === 0 && Array.isArray(responseData.data)) {
        tableList.value = responseData.data
        console.log('Loaded table list:', tableList.value)
      } else {
        throw new Error(responseData.message || '获取表格列表失败')
      }
    } catch (error: any) {
      console.error('获取表格列表失败:', error)
      message.error(error.message || '获取表格列表失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 监听变更
  watch([tables, tablePositions], () => {
    if (!isComponentMounted.value || isHistoryUpdating.value) return
    
    try {
      if (tables.value.length > 0) {
        addHistory()
      }
    } catch (error) {
      console.error('Watch callback error:', error)
    }
  }, { deep: true })

  // 监听路由变化
  watch(() => route.path, async (newPath, oldPath) => {
    if (!isComponentMounted.value || newPath === oldPath) return
    
    try {
      if (hasActualChanges.value) {
        await Modal.confirm({
          title: '提示',
          content: '有未保存的更改，是否保存？',
          okText: '保存',
          cancelText: '不保存',
          async onOk() {
            try {
              await handleSave()
            } catch (error) {
              console.error('Failed to save before route change:', error)
            }
          }
        })
      }
    } catch (error) {
      console.error('Route change watch error:', error)
    }
  }, { immediate: false })

  // 监听表格数据变化
  watch(() => tables.value, (newTables) => {
    if (!isComponentMounted.value) return
    
    try {
      if (newTables.length > 0 && !originalState.value) {
        console.log('Saving initial state...')
        saveCurrentState()
      }
    } catch (error) {
      console.error('Error in tables watcher:', error)
    }
  }, { deep: true, immediate: false })

  // 组件挂载状态管理
  onMounted(() => {
    isComponentMounted.value = true
  })

  onUnmounted(() => {
    isComponentMounted.value = false
  })

  return {
    loading,
    tableList,
    tables,
    activeTable,
    selectedTableData,
    tablePositions,
    scale,
    viewportX,
    viewportY,
    createLoading,
    previewVisible,
    ddlContent,
    createForm,
    rules,
    canUndo,
    canRedo,
    handleBack,
    handleSave,
    handleUndo,
    handleRedo,
    handleZoomIn,
    handleZoomOut,
    handleFitScreen,
    handlePreviewDDL,
    handleSelectTable,
    handleTableMove,
    handlePositionChange,
    handleUpdateTable,
    handleResetTable,
    handleCreate,
    fetchTableList,
    initHistory
  }
} 