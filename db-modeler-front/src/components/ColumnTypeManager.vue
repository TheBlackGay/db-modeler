<template>
  <div class="column-type-manager">
    <el-card class="column-type-card">
      <template #header>
        <div class="card-header">
          <span>列类型管理</span>
          <div class="header-actions">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small" 
                @click="openCreateColumnTypeDialog"
              >
                创建列类型
              </el-button>
              <el-button 
                type="success" 
                size="small" 
                @click="refreshColumnTypes"
              >
                刷新列表
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>

      <el-table 
        :data="columnTypes" 
        border 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="类型名称" prop="name" width="200">
          <template #default="{ row }">
            <el-tag>{{ row.name }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="数据库类型" prop="databaseType" width="150">
          <template #default="{ row }">
            <el-tag type="info">{{ row.databaseType }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="基础类型" prop="baseType" width="150">
          <template #default="{ row }">
            <el-tag type="success">{{ row.baseType }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="长度/精度" prop="length" width="120">
          <template #default="{ row }">
            {{ row.length || '不限制' }}
          </template>
        </el-table-column>

        <el-table-column label="描述" prop="description" width="250">
          <template #default="{ row }">
            {{ row.description || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small"
                @click="editColumnType(row)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="deleteColumnType(row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchColumnTypes"
        @current-change="fetchColumnTypes"
        class="pagination"
      />
    </el-card>

    <el-dialog 
      v-model="columnTypeDialogVisible" 
      :title="isEditMode ? '编辑列类型' : '创建列类型'"
      width="600px"
    >
      <el-form 
        :model="columnTypeForm" 
        label-width="120px"
        ref="columnTypeFormRef"
        :rules="columnTypeRules"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input 
            v-model="columnTypeForm.name" 
            placeholder="请输入类型名称"
          />
        </el-form-item>

        <el-form-item label="数据库类型" prop="databaseType">
          <el-select 
            v-model="columnTypeForm.databaseType" 
            placeholder="选择数据库类型"
            filterable
          >
            <el-option 
              v-for="type in databaseTypes" 
              :key="type" 
              :value="type"
            >
              {{ type }}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="基础类型" prop="baseType">
          <el-select 
            v-model="columnTypeForm.baseType" 
            placeholder="选择基础类型"
            filterable
          >
            <el-option-group 
              v-for="group in baseTypeGroups" 
              :key="group.label" 
              :label="group.label"
            >
              <el-option 
                v-for="type in group.types" 
                :key="type" 
                :value="type"
              >
                {{ type }}
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="长度/精度" prop="length">
          <el-input-number 
            v-model="columnTypeForm.length" 
            :min="0" 
            controls-position="right"
            placeholder="长度/精度"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="columnTypeForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入列类型描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="columnTypeDialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="saveColumnType"
          :loading="saving"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  listColumnTypes, 
  createColumnType, 
  updateColumnType, 
  deleteColumnType 
} from '@/api/columnType'

const columnTypes = ref([])
const loading = ref(false)
const saving = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const columnTypeDialogVisible = ref(false)
const isEditMode = ref(false)
const columnTypeFormRef = ref(null)

const databaseTypes = [
  'MySQL', 'PostgreSQL', 'SQLite', 
  'SQL Server', 'Oracle', 'MariaDB'
]

const baseTypeGroups = [
  {
    label: '数值类型',
    types: ['INT', 'FLOAT', 'DECIMAL', 'DOUBLE']
  },
  {
    label: '字符串类型',
    types: ['VARCHAR', 'CHAR', 'TEXT']
  },
  {
    label: '日期时间类型',
    types: ['DATE', 'DATETIME', 'TIMESTAMP']
  },
  {
    label: '二进制类型',
    types: ['BLOB', 'BINARY']
  }
]

const columnTypeForm = reactive({
  id: null,
  name: '',
  databaseType: '',
  baseType: '',
  length: null,
  description: ''
})

const columnTypeRules = {
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 1, max: 50, message: '类型名称长度必须在1-50之间', trigger: 'blur' }
  ],
  databaseType: [
    { required: true, message: '请选择数据库类型', trigger: 'change' }
  ],
  baseType: [
    { required: true, message: '请选择基础类型', trigger: 'change' }
  ]
}

const fetchColumnTypes = async () => {
  try {
    loading.value = true
    const response = await listColumnTypes({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    columnTypes.value = response.columnTypes
    total.value = response.total
  } catch (error) {
    ElMessage.error('获取列类型列表失败')
  } finally {
    loading.value = false
  }
}

const openCreateColumnTypeDialog = () => {
  isEditMode.value = false
  columnTypeDialogVisible.value = true
  resetColumnTypeForm()
}

const editColumnType = (row) => {
  isEditMode.value = true
  columnTypeDialogVisible.value = true
  Object.assign(columnTypeForm, { ...row })
}

const resetColumnTypeForm = () => {
  Object.assign(columnTypeForm, {
    id: null,
    name: '',
    databaseType: '',
    baseType: '',
    length: null,
    description: ''
  })
}

const saveColumnType = async () => {
  try {
    await columnTypeFormRef.value.validate()
    saving.value = true

    const saveMethod = isEditMode.value ? updateColumnType : createColumnType
    await saveMethod(columnTypeForm)

    ElMessage.success(isEditMode.value ? '更新列类型成功' : '创建列类型成功')
    columnTypeDialogVisible.value = false
    fetchColumnTypes()
  } catch (error) {
    ElMessage.error(isEditMode.value ? '更新列类型失败' : '创建列类型失败')
  } finally {
    saving.value = false
  }
}

const deleteColumnType = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除列类型 "${row.name}" 吗？`, 
      '删除确认', 
      { type: 'warning' }
    )

    await deleteColumnType(row.id)
    ElMessage.success('删除列类型成功')
    fetchColumnTypes()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除列类型失败')
    }
  }
}

const refreshColumnTypes = () => {
  currentPage.value = 1
  fetchColumnTypes()
}

onMounted(fetchColumnTypes)
</script>

<style scoped>
.column-type-manager {
  width: 100%;
}

.column-type-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
