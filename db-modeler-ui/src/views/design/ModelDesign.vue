<template>
  <div class="model-design">
    <ModelSidebar />
    <div class="model-content">
      <template v-if="currentTableData">
        <div class="content-header">
          <div class="header-title">
            <h2>{{ currentTableData.name }}</h2>
            <span class="table-comment" v-if="currentTableData.comment">{{ currentTableData.comment }}</span>
          </div>
          <div class="header-actions">
            <a-button type="primary" @click="handleEditTable">
              <template #icon><edit-outlined /></template>
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除这个表吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDeleteTable"
            >
              <a-button danger>
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </div>

        <a-spin :spinning="loading">
          <a-table
            :columns="columns"
            :data-source="currentTableData.fields"
            :pagination="false"
            size="middle"
            :row-key="record => record.id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <span>{{ record.type }}{{ record.length ? `(${record.length})` : '' }}</span>
              </template>
              <template v-else-if="column.key === 'nullable'">
                <a-tag :color="record.nullable ? 'blue' : 'red'">
                  {{ record.nullable ? '可空' : '非空' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'primaryKey'">
                <a-tag color="gold" v-if="record.primaryKey">主键</a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" @click="handleEditField(record)">
                    <template #icon><edit-outlined /></template>
                  </a-button>
                  <a-popconfirm
                    title="确定要删除这个字段吗？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDeleteField(record)"
                  >
                    <a-button type="link" danger>
                      <template #icon><delete-outlined /></template>
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-spin>
      </template>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useGlobalStore } from '@/stores/global'
import ModelSidebar from './ModelDesign/ModelSidebar.vue'
import {
  HomeOutlined,
  TableOutlined,
  DatabaseOutlined,
  FundViewOutlined,
  PartitionOutlined,
  BookOutlined,
  EyeOutlined,
  SettingOutlined,
  MenuOutlined,
  LeftOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { getTableList, getTableDetail, deleteTable } from '@/api/table'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

// 菜单状态
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 加载状态
const loading = ref(false)

// 数据列表
interface DataItem {
  id: string | number
  name: string
  [key: string]: any
}

const tableList = ref<DataItem[]>([])
const entityList = ref<DataItem[]>([])
const viewList = ref<DataItem[]>([])
const relationList = ref<DataItem[]>([])
const dictionaryList = ref<DataItem[]>([])

// 当前选中的表数据
const currentTableData = ref<any>(null)

// 表格列定义
const columns = [
  {
    title: '字段名',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 150
  },
  {
    title: '可空',
    dataIndex: 'nullable',
    key: 'nullable',
    width: 80
  },
  {
    title: '主键',
    dataIndex: 'primaryKey',
    key: 'primaryKey',
    width: 80
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 150
  },
  {
    title: '注释',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right'
  }
]

// 处理菜单选择
const handleMenuSelect = async ({ key }: { key: string }) => {
  const [type, id] = key.split('-')
  if (key === 'home') {
    router.push({ name: 'model-home', params: { id: projectId } })
    return
  }

  try {
    loading.value = true
    switch (type) {
      case 'table':
        // 获取表的详细数据
        const tableData = await getTableDetail(projectId, id)
        currentTableData.value = tableData
        break
      case 'entity':
        // TODO: 处理实体数据
        break
      case 'view':
        // TODO: 处理视图数据
        break
      case 'relation':
        // TODO: 处理关系数据
        break
      case 'dict':
        // TODO: 处理字典数据
        break
    }
  } catch (error: any) {
    console.error('获取数据失败:', error)
    message.error(error.message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

// 处理编辑表
const handleEditTable = () => {
  if (!currentTableData.value) return
  // TODO: 实现编辑表的逻辑
  message.info('编辑表功能开发中')
}

// 处理删除表
const handleDeleteTable = async () => {
  if (!currentTableData.value) return
  
  try {
    loading.value = true
    await deleteTable(projectId, currentTableData.value.id)
    message.success('删除成功')
    currentTableData.value = null
    // 重新获取表格列表
    fetchData()
  } catch (error: any) {
    message.error(error.message || '删除失败')
  } finally {
    loading.value = false
  }
}

// 处理编辑字段
const handleEditField = (record: any) => {
  // TODO: 实现编辑字段的逻辑
  message.info('编辑字段功能开发中')
}

// 处理删除字段
const handleDeleteField = (record: any) => {
  // TODO: 实现删除字段的逻辑
  message.info('删除字段功能开发中')
}

// 获取数据列表
const fetchData = async () => {
  try {
    loading.value = true
    // 获取表格列表
    const tableRes = await getTableList(projectId)
    tableList.value = Array.isArray(tableRes) ? tableRes : []
    
    // TODO: 获取其他数据列表
    // 这里暂时用模拟数据
    entityList.value = [
      { id: 1, name: '用户实体' },
      { id: 2, name: '订单实体' },
      { id: 3, name: '商品实体' }
    ]
    
    viewList.value = [
      { id: 1, name: '用户订单视图' },
      { id: 2, name: '商品销售视图' }
    ]
    
    relationList.value = [
      { id: 1, name: '用户-订单关系' },
      { id: 2, name: '订单-商品关系' }
    ]
    
    dictionaryList.value = [
      { id: 1, name: '用户状态字典' },
      { id: 2, name: '订单状态字典' },
      { id: 3, name: '商品类型字典' }
    ]
  } catch (error: any) {
    console.error('获取数据失败:', error)
    message.error(error.message || '获取数据失败')
  } finally {
    loading.value = false
  }
}

// 根据当前路由设置选中的菜单项
const initSelectedKey = () => {
  const routeName = route.name as string
  const itemId = route.params.itemId
  if (routeName && itemId) {
    const type = routeName.replace('model-', '').replace('-detail', '')
    selectedKeys.value = [`${type}-${itemId}`]
  } else if (routeName) {
    selectedKeys.value = [routeName.replace('model-', '')]
  }
}

onMounted(() => {
  initSelectedKey()
  fetchData()
})
</script>

<style lang="scss" scoped>
.model-design {
  height: 100%;
  display: flex;
  background-color: #f0f2f5;
  margin: -40px;

  .model-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 24px;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .header-title {
        h2 {
          margin: 0;
          font-size: 20px;
          line-height: 28px;
        }

        .table-comment {
          margin-left: 12px;
          color: #666;
        }
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
