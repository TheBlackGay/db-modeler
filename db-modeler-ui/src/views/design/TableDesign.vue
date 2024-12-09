<template>
  <div class="pdm-table-design">
    <!-- 顶部工具栏 -->
    <div class="tool-bar">
      <div class="tool-group">
        <a-button type="text" @click="handleBack">
          <template #icon><left-outlined /></template>
          返回
        </a-button>
      </div>
      <div class="tool-group">
        <a-button type="text" @click="handleSave">
          <template #icon><save-outlined /></template>
          保存
        </a-button>
        <a-button type="text" @click="handleUndo" :disabled="!canUndo">
          <template #icon><undo-outlined /></template>
          撤销
        </a-button>
        <a-button type="text" @click="handleRedo" :disabled="!canRedo">
          <template #icon><redo-outlined /></template>
          重做
        </a-button>
      </div>
      <div class="tool-group">
        <a-button type="text" @click="handleZoomIn">
          <template #icon><zoom-in-outlined /></template>
          放大
        </a-button>
        <a-button type="text" @click="handleZoomOut">
          <template #icon><zoom-out-outlined /></template>
          缩小
        </a-button>
        <a-button type="text" @click="handleFitScreen">
          <template #icon><fullscreen-outlined /></template>
          适应屏幕
        </a-button>
      </div>
      <div class="tool-group">
        <a-button type="text">
          <template #icon><export-outlined /></template>
          导出
        </a-button>
        <a-button type="text">
          <template #icon><import-outlined /></template>
          导入
        </a-button>
        <a-button type="text" @click="handlePreviewDDL">
          <template #icon><eye-outlined /></template>
          预览DDL
        </a-button>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel-header">
          <span class="title">数据表</span>
          <a-button type="primary" size="small" @click="showCreateModal = true">
            <template #icon><plus-outlined /></template>
            新建表
          </a-button>
        </div>
        <div class="panel-content">
          <a-input-search v-model:value="searchText" placeholder="搜索表" size="small" />
          <div class="table-list">
            <a-spin :spinning="loading">
              <a-list :data-source="tableList" :pagination="false">
                <template #renderItem="{ item }">
                  <a-list-item @click="handleSelectTable(item)" :class="{ active: activeTable?.id === item.id }">
                    {{ item.displayName }}
                  </a-list-item>
                </template>
              </a-list>
            </a-spin>
          </div>
        </div>
      </div>

      <!-- 中间画布区域 -->
      <div class="canvas-area" ref="canvasRef">
        <svg
          :width="canvasWidth"
          :height="canvasHeight"
          @mousedown="handleCanvasMouseDown"
          @wheel="handleCanvasWheel"
        >
          <!-- 缩放和平移组 -->
          <g :transform="`translate(${viewportX}, ${viewportY}) scale(${scale})`">
            <!-- 网格背景 -->
            <pattern
              id="grid"
              :width="20"
              :height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#f0f0f0"
                stroke-width="0.5"
              />
            </pattern>
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
            />

            <!-- 表格节点 -->
            <template v-for="table in tables" :key="table.id">
              <table-node
                :table="table"
                :x="tablePositions[table.id]?.x || 0"
                :y="tablePositions[table.id]?.y || 0"
                :is-active="activeTable?.id === table.id"
                @select="handleSelectTable(table)"
                @move="(x, y) => handleTableMove(table.id, x, y)"
              />
            </template>
          </g>
        </svg>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-header">
          <span class="title">属性</span>
        </div>
        <div class="panel-content">
          <!-- 属性编辑表单 -->
        </div>
      </div>
    </div>

    <!-- 新建表对话框 -->
    <a-modal v-model:visible="showCreateModal" title="新建表" :confirm-loading="createLoading" @ok="handleCreate">
      <a-form :model="createForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" :rules="rules">
        <a-form-item label="表代码" name="code" required>
          <a-input v-model:value="createForm.code" placeholder="请输入表代码" />
        </a-form-item>
        <a-form-item label="表名" name="displayName" required>
          <a-input v-model:value="createForm.displayName" placeholder="请输入表名" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="createForm.comment" placeholder="请输入备注信息" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="createForm.type">
            <a-select-option value="TABLE">表</a-select-option>
            <a-select-option value="VIEW">视图</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="域">
          <a-select v-model:value="createForm.domain">
            <a-select-option value="BUSINESS">业务域</a-select-option>
            <a-select-option value="SYSTEM">系统域</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- DDL预览对话框 -->
    <a-modal v-model:visible="previewVisible" title="DDL预览" :footer="null">
      <pre>{{ ddlContent }}</pre>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Table, TableListItem, CreateTableRequest } from '@/types/table'
import { 
  getTableDesigns, 
  getTableDesign, 
  createTableDesign,
  updateTableDesign,
  deleteTableDesign 
} from '@/api/tableDesign'

const router = useRouter()
const route = useRoute()

// 表格列表数据
const tableList = ref<TableListItem[]>([])
const searchText = ref('')
const loading = ref(false)

// 新建表对话框
const showCreateModal = ref(false)
const createLoading = ref(false)
const createForm = ref<CreateTableRequest>({
  code: '',
  displayName: '',
  comment: '',
  type: 'TABLE',
  domain: 'BUSINESS',
  projectId: ''
})
const rules = {
  code: [{ required: true, message: '请输入表代码' }],
  displayName: [{ required: true, message: '请输入表名' }]
}

// 画布状态
const canvasRef = ref<HTMLDivElement>()
const scale = ref(1)
const viewportX = ref(0)
const viewportY = ref(0)
const canvasWidth = ref(1000)
const canvasHeight = ref(800)
const tables = ref<Table[]>([])
const tablePositions = ref<Record<string, { x: number; y: number }>>({})
const activeTable = ref<Table | null>(null)

// 历史记录
const history = ref<{ positions: Record<string, { x: number; y: number }> }[]>([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// DDL预览
const previewVisible = ref(false)
const ddlContent = ref('')

// 获取表格列表
const fetchTableList = async () => {
  loading.value = true
  try {
    const { data } = await getTableDesigns()
    tableList.value = data
  } catch (error) {
    message.error('获取表格列表失败')
  } finally {
    loading.value = false
  }
}

// 获取表格详情
const fetchTableDetail = async (tableId: string) => {
  try {
    const { data } = await getTableDesign(tableId)
    const index = tables.value.findIndex(t => t.id === tableId)
    if (index > -1) {
      tables.value[index] = data
    } else {
      tables.value.push(data)
      // 设置初始位置
      tablePositions.value[data.id] = {
        x: Math.random() * 500,
        y: Math.random() * 500
      }
    }
  } catch (error) {
    message.error('获取表格详情失败')
  }
}

// 新建表
const handleCreate = async () => {
  if (!createForm.value.displayName) {
    message.warning('请输入表名')
    return
  }
  if (!createForm.value.code) {
    message.warning('请输入表代码')
    return
  }
  
  createLoading.value = true
  try {
    const projectId = route.params.projectId as string
    // 构造请求数据，确保字段名称正确
    const requestData = {
      code: createForm.value.code,
      displayName: createForm.value.displayName,
      comment: createForm.value.comment,
      type: createForm.value.type || 'TABLE',
      domain: createForm.value.domain || 'BUSINESS',
      projectId
    }
    
    const { data } = await createTableDesign(requestData)
    message.success('创建成功')
    showCreateModal.value = false
    // 重置表单
    createForm.value = { 
      code: '', 
      displayName: '', 
      comment: '', 
      type: 'TABLE', 
      domain: 'BUSINESS', 
      projectId: ''
    }
    await fetchTableList()
    if (data) {
      await fetchTableDetail(data.id)
    }
  } catch (error: any) {
    console.error('创建表失败:', error)
    message.error(error.response?.data?.message || '创建失败')
  } finally {
    createLoading.value = false
  }
}

// 选择表格
const handleSelectTable = async (table: TableListItem | Table) => {
  if (!tables.value.find(t => t.id === table.id)) {
    await fetchTableDetail(table.id)
  }
  activeTable.value = tables.value.find(t => t.id === table.id) || null
}

// 移动表格
const handleTableMove = (tableId: string, x: number, y: number) => {
  tablePositions.value[tableId] = { x, y }
  // 添加历史记录
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push({ positions: { ...tablePositions.value } })
  historyIndex.value++
}

// 撤销
const handleUndo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    tablePositions.value = { ...history.value[historyIndex.value].positions }
  }
}

// 重做
const handleRedo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    tablePositions.value = { ...history.value[historyIndex.value].positions }
  }
}

// 缩放和平移
const handleCanvasWheel = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    // 缩放
    event.preventDefault()
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newScale = scale.value * delta
    if (newScale >= 0.1 && newScale <= 3) {
      scale.value = newScale
    }
  } else {
    // 平移
    viewportX.value -= event.deltaX
    viewportY.value -= event.deltaY
  }
}

const handleCanvasMouseDown = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    const startX = event.clientX
    const startY = event.clientY
    const initialX = viewportX.value
    const initialY = viewportY.value

    const handleMouseMove = (e: MouseEvent) => {
      viewportX.value = initialX + (e.clientX - startX)
      viewportY.value = initialY + (e.clientY - startY)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

// 缩放控制
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

// 保存
const handleSave = () => {
  // TODO: 保存表格位置信息
  message.success('保存成功')
}

// 返回
const handleBack = () => {
  router.push(`/projects/${route.params.projectId}`)
}

// 预览DDL
const handlePreviewDDL = async () => {
  if (!activeTable.value) {
    message.error('请先选择表格')
    return
  }

  try {
    const data = await getTableDesign(activeTable.value.id)
    ddlContent.value = generateDDL(data)
    previewVisible.value = true
  } catch (error) {
    message.error('获取表格详情失败')
  }
}

// 生成DDL
const generateDDL = (table: Table) => {
  // TODO: 实现DDL生成逻辑
  return ''
}

// 更新画布尺寸
const updateCanvasSize = () => {
  if (canvasRef.value) {
    canvasWidth.value = canvasRef.value.clientWidth
    canvasHeight.value = canvasRef.value.clientHeight
  }
}

onMounted(() => {
  fetchTableList()
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
})
</script>

<style lang="scss" scoped>
.pdm-table-design {
  display: flex;
  flex-direction: column;
  height: 100%;

  .tool-bar {
    height: 48px;
    padding: 0 16px;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 24px;

    .tool-group {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      border-right: 1px solid #f0f0f0;

      &:last-child {
        border-right: none;
      }
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;

    .left-panel {
      width: 280px;
      background-color: #fff;
      border-right: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;

      .panel-header {
        height: 48px;
        padding: 0 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          font-weight: 500;
        }
      }

      .panel-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;

        .table-list {
          margin-top: 16px;

          .ant-list-item {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.3s;

            &:hover {
              background-color: #f5f5f5;
            }

            &.active {
              background-color: #e6f7ff;
              color: #1890ff;
            }
          }
        }
      }
    }

    .canvas-area {
      flex: 1;
      background-color: #fafafa;
      overflow: auto;
      position: relative;
    }

    .right-panel {
      width: 320px;
      background-color: #fff;
      border-left: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;

      .panel-header {
        height: 48px;
        padding: 0 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;

        .title {
          font-weight: 500;
        }
      }

      .panel-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
      }
    }
  }
}
</style>
