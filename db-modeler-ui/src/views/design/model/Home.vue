<template>
  <div class="model-home">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <a-spin tip="加载中...">
        <div class="content" />
      </a-spin>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error-state">
      <a-result
        status="error"
        title="加载失败"
        sub-title="请检查网络连接后重试"
      >
        <template #extra>
          <a-button type="primary" @click="loadTableDesign">
            重试
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 正常状态 -->
    <div v-else-if="isInitialized" class="content">
      <!-- 表头部信息 -->
      <div class="table-header">
        <div class="table-title">
          <h2>{{ computedValue.title }}</h2>
          <span class="table-comment" v-if="table?.comment">{{ table.comment }}</span>
        </div>
        <div class="table-actions">
          <a-space>
            <a-button type="primary">
              <template #icon><plus-outlined /></template>
              添加字段
            </a-button>
            <a-button>
              <template #icon><edit-outlined /></template>
              编辑表
            </a-button>
            <a-button>
              <template #icon><copy-outlined /></template>
              复制表
            </a-button>
            <a-button danger>
              <template #icon><delete-outlined /></template>
              删除表
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- 表格工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索字段名称、注释"
            style="width: 250px"
            @search="onSearch"
          />
        </div>
        <div class="toolbar-right">
          <a-space>
            <a-select
              v-model:value="dataType"
              style="width: 120px"
              placeholder="数据类型"
            >
              <a-select-option value="">全部类型</a-select-option>
              <a-select-option value="varchar">VARCHAR</a-select-option>
              <a-select-option value="int">INT</a-select-option>
              <a-select-option value="datetime">DATETIME</a-select-option>
            </a-select>
            <a-select
              v-model:value="status"
              style="width: 100px"
              placeholder="状态"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="nullable">可空</a-select-option>
              <a-select-option value="required">必填</a-select-option>
            </a-select>
            <a-select
              v-model:value="sortOrder"
              style="width: 120px"
              placeholder="排序方式"
            >
              <a-select-option value="asc">默认排序</a-select-option>
              <a-select-option value="name_asc">名称升序</a-select-option>
              <a-select-option value="name_desc">名称降序</a-select-option>
            </a-select>
          </a-space>
        </div>
      </div>
      
      <!-- 字段列表 -->
      <div class="table-content">
        <a-table
          :columns="columns"
          :data-source="computedValue.fields"
          :pagination="false"
          size="middle"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'type'">
              <span>{{ record.type }}{{ record.length ? `(${record.length})` : '' }}</span>
            </template>
            <template v-else-if="column.key === 'nullable'">
              <a-tag :color="record.nullable ? 'blue' : 'red'">
                {{ record.nullable ? '可空' : '必填' }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'primaryKey'">
              <a-tag color="gold" v-if="record.primaryKey">主键</a-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small">
                  <template #icon><edit-outlined /></template>
                  编辑
                </a-button>
                <a-button type="link" danger size="small">
                  <template #icon><delete-outlined /></template>
                  删除
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTableDesign } from '@/composables/useTableDesign'
import {
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

// 搜索和筛选状态
const searchText = ref('')
const dataType = ref('')
const status = ref('')
const sortOrder = ref('asc')

// 表格列定义
const columns = [
  {
    title: '字段名',
    dataIndex: 'name',
    key: 'name',
    width: '15%'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: '15%'
  },
  {
    title: '长度/精度',
    dataIndex: 'length',
    key: 'length',
    width: '10%'
  },
  {
    title: '可空',
    dataIndex: 'nullable',
    key: 'nullable',
    width: '8%'
  },
  {
    title: '主键',
    dataIndex: 'primaryKey',
    key: 'primaryKey',
    width: '8%'
  },
  {
    title: '自增',
    dataIndex: 'autoIncrement',
    key: 'autoIncrement',
    width: '8%'
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: '12%'
  },
  {
    title: '注释',
    dataIndex: 'comment',
    key: 'comment',
    width: '15%'
  },
  {
    title: '操作',
    key: 'action',
    width: '12%'
  }
]

// 使用 tableId 初始化
const {
  table,
  tableFields,
  tableName,
  isInitialized,
  isLoading,
  hasError,
  loadTableDesign
} = useTableDesign(projectId.value)

// 确保数据加载
onMounted(async () => {
  try {
    await loadTableDesign()
  } catch (error) {
    console.error('Failed to load table design:', error)
  }
})

// 搜索处理
const onSearch = (value: string) => {
  searchText.value = value
}

// 安全的计算属性
const computedValue = computed(() => {
  if (!isInitialized.value || isLoading.value) {
    return {
      title: '加载中...',
      fields: []
    }
  }
  
  return {
    title: table.value?.name || '未命名表',
    fields: tableFields.value || []
  }
})
</script>

<style lang="scss" scoped>
.model-home {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  .loading-state,
  .error-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      .table-title {
        h2 {
          margin: 0;
          font-size: 20px;
          line-height: 28px;
          color: rgba(0, 0, 0, 0.85);
        }
        
        .table-comment {
          margin-left: 12px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
    
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .toolbar-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    
    .table-content {
      flex: 1;
      overflow: auto;
      
      :deep(.ant-table-wrapper) {
        border: 1px solid #f0f0f0;
        border-radius: 2px;
      }
      
      :deep(.ant-table) {
        .ant-table-thead > tr > th {
          background: #fafafa;
          font-weight: 500;
        }
        
        .ant-table-tbody > tr > td {
          .ant-btn-link {
            padding: 0 4px;
          }
        }
      }
    }
  }
}
</style>
