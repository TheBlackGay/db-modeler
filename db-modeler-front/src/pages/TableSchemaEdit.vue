<template>
  <div class="table-schema-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑表结构' : '创建表结构' }}</span>
        </div>
      </template>

      <el-form 
        ref="tableSchemaForm" 
        :model="tableSchema" 
        :rules="rules" 
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据库" prop="databaseId">
              <el-select 
                v-model="tableSchema.databaseId" 
                placeholder="选择数据库"
                :disabled="isEditMode"
              >
                <el-option 
                  v-for="db in databases" 
                  :key="db.id" 
                  :label="db.name" 
                  :value="db.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表类型" prop="type">
              <el-select v-model="tableSchema.type">
                <el-option label="表" value="table" />
                <el-option label="视图" value="view" />
                <el-option label="物化视图" value="materialized_view" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="表名" prop="name">
              <el-input v-model="tableSchema.name" placeholder="请输入表名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="description">
              <el-input 
                v-model="tableSchema.description" 
                placeholder="请输入表描述" 
                type="textarea" 
                :rows="1" 
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">列定义</el-divider>

        <el-table 
          ref="columnsTable"
          :data="tableSchema.columns" 
          style="width: 100%" 
          stripe 
          border
        >
          <el-table-column label="列名" width="200">
            <template #default="scope">
              <el-form-item 
                :prop="`columns.${scope.$index}.name`"
                :rules="{
                  required: true, 
                  message: '列名不能为空', 
                  trigger: 'blur'
                }"
              >
                <el-input 
                  v-model="scope.row.name" 
                  placeholder="请输入列名" 
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="数据类型" width="200">
            <template #default="scope">
              <el-form-item 
                :prop="`columns.${scope.$index}.type`"
                :rules="{
                  required: true, 
                  message: '数据类型不能为空', 
                  trigger: 'blur'
                }"
              >
                <el-select 
                  v-model="scope.row.type" 
                  placeholder="选择数据类型"
                >
                  <el-option-group label="数值类型">
                    <el-option value="INT">INT</el-option>
                    <el-option value="BIGINT">BIGINT</el-option>
                    <el-option value="FLOAT">FLOAT</el-option>
                    <el-option value="DOUBLE">DOUBLE</el-option>
                    <el-option value="DECIMAL">DECIMAL</el-option>
                  </el-option-group>
                  <el-option-group label="字符串类型">
                    <el-option value="VARCHAR">VARCHAR</el-option>
                    <el-option value="CHAR">CHAR</el-option>
                    <el-option value="TEXT">TEXT</el-option>
                  </el-option-group>
                  <el-option-group label="日期类型">
                    <el-option value="DATE">DATE</el-option>
                    <el-option value="DATETIME">DATETIME</el-option>
                    <el-option value="TIMESTAMP">TIMESTAMP</el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="可空" width="100">
            <template #default="scope">
              <el-form-item :prop="`columns.${scope.$index}.nullable`">
                <el-switch 
                  v-model="scope.row.nullable" 
                  active-text="是" 
                  inactive-text="否" 
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="主键" width="100">
            <template #default="scope">
              <el-form-item :prop="`columns.${scope.$index}.primaryKey`">
                <el-switch 
                  v-model="scope.row.primaryKey" 
                  active-text="是" 
                  inactive-text="否" 
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="唯一" width="100">
            <template #default="scope">
              <el-form-item :prop="`columns.${scope.$index}.unique`">
                <el-switch 
                  v-model="scope.row.unique" 
                  active-text="是" 
                  inactive-text="否" 
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="默认值" width="200">
            <template #default="scope">
              <el-form-item :prop="`columns.${scope.$index}.defaultValue`">
                <el-input 
                  v-model="scope.row.defaultValue" 
                  placeholder="默认值" 
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button 
                type="danger" 
                icon="Delete" 
                @click="deleteColumn(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>

        <el-button 
          type="primary" 
          icon="Plus" 
          style="margin-top: 10px"
          @click="addColumn"
        >
          添加列
        </el-button>

        <el-divider content-position="left">索引定义</el-divider>

        <el-table 
          :data="tableSchema.indexes" 
          style="width: 100%" 
          stripe 
          border
        >
          <el-table-column label="索引列" width="300">
            <template #default="scope">
              <el-select 
                v-model="scope.row.columns" 
                multiple 
                placeholder="选择索引列"
              >
                <el-option 
                  v-for="column in tableSchema.columns" 
                  :key="column.name" 
                  :label="column.name" 
                  :value="column.name"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="唯一索引" width="200">
            <template #default="scope">
              <el-switch 
                v-model="scope.row.unique" 
                active-text="是" 
                inactive-text="否" 
              />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button 
                type="danger" 
                icon="Delete" 
                @click="deleteIndex(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>

        <el-button 
          type="primary" 
          icon="Plus" 
          style="margin-top: 10px"
          @click="addIndex"
        >
          添加索引
        </el-button>

        <el-form-item style="margin-top: 20px">
          <el-button 
            type="primary" 
            @click="submitForm"
          >
            {{ isEditMode ? '更新' : '创建' }}
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  createTableSchema, 
  updateTableSchema, 
  getTableSchemaDetail 
} from '@/api/tableSchema'
import { fetchDatabases } from '@/api/database'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id)
const tableSchemaForm = ref(null)
const columnsTable = ref(null)
const databases = ref([])

const tableSchema = ref({
  databaseId: null,
  name: '',
  description: '',
  type: 'table',
  columns: [],
  indexes: []
})

const rules = {
  databaseId: [
    { required: true, message: '请选择数据库', trigger: 'change' }
  ],
  name: [
    { required: true, message: '表名不能为空', trigger: 'blur' },
    { min: 1, max: 64, message: '表名长度必须在1-64个字符之间', trigger: 'blur' }
  ]
}

const fetchDatabaseList = async () => {
  try {
    const response = await fetchDatabases()
    databases.value = response.data
  } catch (error) {
    ElMessage.error('获取数据库列表失败')
  }
}

const fetchTableSchemaDetail = async () => {
  if (!isEditMode.value) return

  try {
    const response = await getTableSchemaDetail(route.params.id)
    tableSchema.value = { ...response }
  } catch (error) {
    ElMessage.error('获取表结构详情失败')
    router.push('/table-schemas')
  }
}

const addColumn = () => {
  tableSchema.value.columns.push({
    name: '',
    type: '',
    nullable: true,
    primaryKey: false,
    unique: false,
    defaultValue: null
  })
}

const deleteColumn = (index) => {
  tableSchema.value.columns.splice(index, 1)
}

const addIndex = () => {
  tableSchema.value.indexes.push({
    columns: [],
    unique: false
  })
}

const deleteIndex = (index) => {
  tableSchema.value.indexes.splice(index, 1)
}

const submitForm = async () => {
  try {
    await tableSchemaForm.value.validate()
    await columnsTable.value.validate()

    const submitData = { ...tableSchema.value }

    if (isEditMode.value) {
      await updateTableSchema(route.params.id, submitData)
      ElMessage.success('表结构更新成功')
    } else {
      await createTableSchema(submitData)
      ElMessage.success('表结构创建成功')
    }

    router.push('/table-schemas')
  } catch (error) {
    ElMessage.error(isEditMode.value ? '更新失败' : '创建失败')
  }
}

const resetForm = () => {
  tableSchemaForm.value.resetFields()
  if (isEditMode.value) {
    fetchTableSchemaDetail()
  } else {
    tableSchema.value = {
      databaseId: null,
      name: '',
      description: '',
      type: 'table',
      columns: [],
      indexes: []
    }
  }
}

onMounted(() => {
  fetchDatabaseList()
  if (isEditMode.value) {
    fetchTableSchemaDetail()
  }
})
</script>

<style scoped>
.table-schema-edit {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
