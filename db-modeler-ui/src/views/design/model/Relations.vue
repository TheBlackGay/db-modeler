<template>
  <div class="model-relations">
    <div class="content-header">
      <h2>关系图</h2>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateModal">
            <template #icon><plus-outlined /></template>
            新建关系图
          </a-button>
          <a-button>
            <template #icon><import-outlined /></template>
            导入
          </a-button>
          <a-button>
            <template #icon><export-outlined /></template>
            导出
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="content-body">
      <div class="diagram-container" v-if="relations.length > 0">
        <!-- 这里使用X6图形库来渲染关系图 -->
        <div ref="graphContainer" class="graph-container"></div>
      </div>
      <div class="diagram-container" v-else>
        <a-empty description="暂无关系图" />
      </div>
      <div class="diagram-tools">
        <a-space direction="vertical">
          <a-tooltip title="撤销 (Ctrl+Z)">
            <a-button
              shape="circle"
              :disabled="!canUndo"
              @click="handleUndo"
            >
              <template #icon><undo-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="重做 (Ctrl+Shift+Z)">
            <a-button
              shape="circle"
              :disabled="!canRedo"
              @click="handleRedo"
            >
              <template #icon><redo-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-divider style="margin: 8px 0" />
          <a-tooltip title="放大">
            <a-button shape="circle" @click="zoomIn">
              <template #icon><zoom-in-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="缩小">
            <a-button shape="circle" @click="zoomOut">
              <template #icon><zoom-out-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="适应屏幕">
            <a-button shape="circle" @click="fitScreen">
              <template #icon><fullscreen-outlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="实际大小">
            <a-button shape="circle" @click="actualSize">
              <template #icon><compress-outlined /></template>
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>

    <!-- 创建/编辑关系的弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      width="800px"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="源表" name="sourceTableId">
          <a-select
            v-model:value="formData.sourceTableId"
            placeholder="请选择源表"
            @change="handleSourceTableChange"
          >
            <a-select-option
              v-for="table in tables"
              :key="table.id"
              :value="table.id"
            >
              {{ table.displayName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="目标表" name="targetTableId">
          <a-select
            v-model:value="formData.targetTableId"
            placeholder="请选择目标表"
            @change="handleTargetTableChange"
          >
            <a-select-option
              v-for="table in tables"
              :key="table.id"
              :value="table.id"
            >
              {{ table.displayName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="关系类型" name="relationType">
          <a-select
            v-model:value="formData.relationType"
            placeholder="请选择关系类型"
          >
            <a-select-option value="ONE_TO_ONE">一对一</a-select-option>
            <a-select-option value="ONE_TO_MANY">一对多</a-select-option>
            <a-select-option value="MANY_TO_ONE">多对一</a-select-option>
            <a-select-option value="MANY_TO_MANY">多对多</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="列映射" name="columnMappings">
          <a-button
            type="dashed"
            block
            @click="addColumnMapping"
            v-if="formData.sourceTableId && formData.targetTableId"
          >
            <plus-outlined /> 添加列映射
          </a-button>
          <template v-for="(mapping, index) in formData.columnMappings" :key="index">
            <div class="column-mapping">
              <a-row :gutter="16">
                <a-col :span="10">
                  <a-select
                    v-model:value="mapping.sourceColumnName"
                    placeholder="源表列"
                  >
                    <a-select-option
                      v-for="column in sourceColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="10">
                  <a-select
                    v-model:value="mapping.targetColumnName"
                    placeholder="目标表列"
                  >
                    <a-select-option
                      v-for="column in targetColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="4">
                  <a-button
                    type="link"
                    danger
                    @click="removeColumnMapping(index)"
                  >
                    <delete-outlined />
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </template>
        </a-form-item>

        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入关系描述"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  CompressOutlined,
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import { Graph } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'
import { Transform } from '@antv/x6-plugin-transform'
import { History } from '@antv/x6-plugin-history'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import type { TableRelation, TableRelationFormData, RelationType, MappingType } from '@/types/tableRelation'
import type { Table, TableField } from '@/types/table'
import type { GraphLayout, NodePosition } from '@/types/graphLayout'
import * as tableRelationApi from '@/api/tableRelation'
import * as tableDesignApi from '@/api/tableDesign'
import * as graphLayoutApi from '@/api/graphLayout'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash-es'

const route = useRoute()
const projectId = route.params.projectId as string

// 图形相关
const graphContainer = ref<HTMLElement>()
let graph: Graph
let dnd: Dnd
let currentLayout = ref<GraphLayout | null>(null)
let isDragging = false

// 撤销/重做状态
const canUndo = ref(false)
const canRedo = ref(false)

// 数据相关
const relations = ref<TableRelation[]>([])
const tables = ref<Table[]>([])
const sourceColumns = ref<TableField[]>([])
const targetColumns = ref<TableField[]>([])

// 表单相关
const modalVisible = ref(false)
const modalTitle = ref('新建关系')
const formRef = ref()
const formData = reactive<TableRelationFormData>({
  sourceTableId: '',
  targetTableId: '',
  relationType: 'ONE_TO_ONE',
  columnMappings: [],
  description: ''
})

const rules = {
  sourceTableId: [{ required: true, message: '请选择源表' }],
  targetTableId: [{ required: true, message: '请选择目标表' }],
  relationType: [{ required: true, message: '请选择关系类型' }],
  columnMappings: [{ required: true, message: '请添加列映射' }]
}

// 初始化
onMounted(async () => {
  await initGraph()
  await Promise.all([
    loadRelations(),
    loadTables(),
    loadLayout()
  ])
})

// 初始化图形
const initGraph = async () => {
  if (!graphContainer.value) return
  
  graph = new Graph({
    container: graphContainer.value,
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 2
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      }
    },
    // 启用拖拽功能
    translating: {
      restrict: true
    },
    // 启用键盘事件
    keyboard: {
      enabled: true,
      global: true
    }
  })

  // 注册插件
  graph.use(
    new Transform({
      resizing: false,
      rotating: false
    })
  )

  // 注册历史记录插件
  graph.use(
    new History({
      enabled: true,
      beforeAddCommand: (event: string, args: any) => {
        // 只记录节点移动和边连接的操作
        return ['node:move', 'edge:connect'].includes(event)
      }
    })
  )

  // 注册键盘插件
  graph.use(
    new Keyboard({
      enabled: true,
      global: true
    })
  )

  // 监听历史记录变化
  graph.on('history:change', () => {
    canUndo.value = graph.canUndo()
    canRedo.value = graph.canRedo()
  })

  // 注册快捷键
  graph.bindKey(['ctrl+z', 'cmd+z'], () => {
    handleUndo()
    return false
  })

  graph.bindKey(['ctrl+shift+z', 'cmd+shift+z'], () => {
    handleRedo()
    return false
  })

  // 节点拖动开始
  graph.on('node:mousedown', () => {
    isDragging = false
  })

  // 节点拖动中
  graph.on('node:moving', () => {
    isDragging = true
  })

  // 节点拖动结束，保存位置
  graph.on('node:moved', debounce(async () => {
    isDragging = false
    await saveLayout()
  }, 500))
}

// 加载布局
const loadLayout = async () => {
  try {
    const layout = await graphLayoutApi.getProjectLayout(projectId)
    currentLayout.value = layout
  } catch (error) {
    console.error('加载布局失败:', error)
  }
}

// 保存布局
const saveLayout = debounce(async () => {
  if (!graph) return

  const positions: NodePosition[] = []
  const nodes = graph.getNodes()
  
  nodes.forEach(node => {
    const position = node.position()
    positions.push({
      id: node.id as string,
      x: position.x,
      y: position.y
    })
  })

  try {
    if (currentLayout.value) {
      await graphLayoutApi.updateProjectLayout(currentLayout.value.id, positions)
    } else {
      const layout = await graphLayoutApi.saveProjectLayout(projectId, positions)
      currentLayout.value = layout
    }
  } catch (error) {
    message.error('保存布局失败')
  }
}, 500)

// 加载关系数据
const loadRelations = async () => {
  try {
    const data = await tableRelationApi.getProjectRelations(projectId)
    relations.value = data
    renderGraph()
  } catch (error) {
    message.error('加载关系数据失败')
  }
}

// 加载表数据
const loadTables = async () => {
  try {
    const data = await tableDesignApi.getTableDesigns()
    tables.value = data
  } catch (error) {
    message.error('加载表数据失败')
  }
}

// 渲染图形
const renderGraph = () => {
  if (!graph) return
  
  graph.clearCells()
  
  // 添加节点和边
  relations.value.forEach(relation => {
    const sourceTable = tables.value.find(t => t.id === relation.sourceTableId)
    const targetTable = tables.value.find(t => t.id === relation.targetTableId)
    
    if (!sourceTable || !targetTable) return

    // 获取保存的位置
    const sourcePosition = currentLayout.value?.positions.find(p => p.id === sourceTable.id)
    const targetPosition = currentLayout.value?.positions.find(p => p.id === targetTable.id)

    // 创建源表节点
    const sourceNode = graph.addNode({
      id: sourceTable.id,
      x: sourcePosition?.x || 100,
      y: sourcePosition?.y || 100,
      width: 200,
      height: Math.max(80, sourceTable.fields.length * 25 + 40),
      shape: 'html',
      html: () => {
        const div = document.createElement('div')
        div.className = 'table-node'
        div.innerHTML = `
          <div class="table-header">${sourceTable.displayName}</div>
          <div class="table-body">
            ${sourceTable.fields.map(field => `
              <div class="table-field">
                ${field.primaryKey ? '🔑 ' : ''}${field.name}
                <span class="field-type">${field.type}</span>
              </div>
            `).join('')}
          </div>
        `
        return div
      }
    })
    
    // 创建目标表节点
    const targetNode = graph.addNode({
      id: targetTable.id,
      x: targetPosition?.x || 400,
      y: targetPosition?.y || 100,
      width: 200,
      height: Math.max(80, targetTable.fields.length * 25 + 40),
      shape: 'html',
      html: () => {
        const div = document.createElement('div')
        div.className = 'table-node'
        div.innerHTML = `
          <div class="table-header">${targetTable.displayName}</div>
          <div class="table-body">
            ${targetTable.fields.map(field => `
              <div class="table-field">
                ${field.primaryKey ? '🔑 ' : ''}${field.name}
                <span class="field-type">${field.type}</span>
              </div>
            `).join('')}
          </div>
        `
        return div
      }
    })
    
    // 添加关系边
    graph.addEdge({
      id: relation.id,
      source: sourceNode,
      target: targetNode,
      label: formatRelationType(relation.relationType),
      attrs: {
        line: {
          stroke: '#1890ff',
          strokeWidth: 2,
          targetMarker: {
            name: relation.relationType === 'ONE_TO_MANY' ? 'classic' : 'diamond',
            size: 8
          }
        },
        label: {
          fill: '#666',
          fontSize: 12,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none'
        }
      },
      router: {
        name: 'manhattan',
        args: {
          padding: 20
        }
      }
    })
  })
  
  // 如果没有保存的布局，则自动布局
  if (!currentLayout.value) {
    graph.zoomToFit({ padding: 20 })
  }
}

// 图形操作
const zoomIn = () => graph?.zoom(0.1)
const zoomOut = () => graph?.zoom(-0.1)
const fitScreen = () => graph?.fitToContent({ padding: 20 })
const actualSize = () => graph?.zoomTo(1)

// 表单操作
const showCreateModal = () => {
  modalTitle.value = '新建关系'
  modalVisible.value = true
}

const handleSourceTableChange = async (value: string) => {
  const table = tables.value.find(t => t.id === value)
  if (table) {
    sourceColumns.value = table.fields
  }
}

const handleTargetTableChange = async (value: string) => {
  const table = tables.value.find(t => t.id === value)
  if (table) {
    targetColumns.value = table.fields
  }
}

const addColumnMapping = () => {
  formData.columnMappings.push({
    sourceColumnName: '',
    targetColumnName: '',
    mappingType: 'REFERENCE'
  })
}

const removeColumnMapping = (index: number) => {
  formData.columnMappings.splice(index, 1)
}

const handleModalOk = async () => {
  try {
    await formRef.value.validate()
    
    // 验证关系
    const isValid = await tableRelationApi.validateRelation(formData)
    if (!isValid) {
      message.error('关系验证失败')
      return
    }
    
    // 创建关系
    await tableRelationApi.createRelation(projectId, formData)
    message.success('创建成功')
    modalVisible.value = false
    await loadRelations()
  } catch (error) {
    message.error('操作失败')
  }
}

const handleModalCancel = () => {
  formRef.value?.resetFields()
  modalVisible.value = false
}

// 撤销/重做操作
const handleUndo = () => {
  if (graph.canUndo()) {
    graph.undo()
    saveLayout()
  }
}

const handleRedo = () => {
  if (graph.canRedo()) {
    graph.redo()
    saveLayout()
  }
}
</script>

<style lang="scss" scoped>
.model-relations {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .content-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
  }

  .content-body {
    flex: 1;
    background-color: #fff;
    position: relative;
    overflow: hidden;

    .diagram-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .graph-container {
        width: 100%;
        height: 100%;
      }
    }

    .diagram-tools {
      position: absolute;
      right: 24px;
      top: 24px;
      z-index: 1;
    }
  }
}

.column-mapping {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.table-node) {
  border: 1px solid #1890ff;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  cursor: move;
  
  .table-header {
    background: #1890ff;
    color: #fff;
    padding: 8px;
    font-weight: 500;
    text-align: center;
  }
  
  .table-body {
    padding: 8px;
    
    .table-field {
      padding: 4px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      &:last-child {
        border-bottom: none;
      }
      
      .field-type {
        color: #666;
        font-size: 12px;
      }
    }
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
