<template>
  <div class="model-dictionary">
    <div class="content-header">
      <h2>数据字典</h2>
      <div class="header-actions">
        <a-space>
          <a-button type="primary">
            <template #icon><plus-outlined /></template>
            新建字典
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
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="handleDelete(record)">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '代码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
  },
]

const data = ref([
  {
    key: '1',
    name: '性别',
    code: 'gender',
    description: '用户性别',
  },
  {
    key: '2',
    name: '状态',
    code: 'status',
    description: '数据状态',
  },
])

const handleEdit = (record: any) => {
  console.log('Edit:', record)
}

const handleDelete = (record: any) => {
  console.log('Delete:', record)
}
</script>

<style lang="scss" scoped>
.model-dictionary {
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
    padding: 24px;
    overflow-y: auto;
  }
}
</style>
