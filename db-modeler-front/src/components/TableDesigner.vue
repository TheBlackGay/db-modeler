<template>
  <div class="table-designer-container">
    <el-card class="table-designer-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑表' : '创建新表' }}</span>
          <div class="header-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="saveTable"
              :loading="saving"
            >
              保存
            </el-button>
            <el-button 
              type="info" 
              size="small" 
              @click="generateSQL"
            >
              生成 SQL
            </el-button>
          </div>
        </div>
      </template>

      <el-form 
        :model="tableForm" 
        :rules="tableRules" 
        ref="tableFormRef"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="表名" prop="name">
              <el-input 
                v-model="tableForm.name" 
                placeholder="请输入表名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库类型" prop="databaseType">
              <el-select 
                v-model="tableForm.databaseType" 
                placeholder="选择数据库类型"
              >
                <el-option 
                  v-for="type in databaseTypes" 
                  :key="type" 
                  :label="type" 
                  :value="type"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="tableForm.description" 
            type="textarea" 
            :rows="2" 
            placeholder="表描述（可选）"
          />
        </el-form-item>

        <el-divider content-position="left">
          列定义
          <el-button 
            type="text" 
            @click="addColumn"
            icon="el-icon-plus"
          >
            添加列
          </el-button>
        </el-divider>

        <el-table 
          :data="tableForm.columns" 
          border 
          style="width: 100%"
        >
          <el-table-column label="列名" width="180">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.name" 
                placeholder="列名"
              />
            </template>
          </el-table-column>
          <el-table-column label="数据类型" width="200">
            <template #default="{ row }">
              <el-select 
                v-model="row.type" 
                placeholder="选择类型"
              >
                <el-option 
                  v-for="type in columnTypes" 
                  :key="type" 
                  :label="type" 
                  :value="type"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="长度" width="100">
            <template #default="{ row }">
              <el-input-number 
                v-model="row.length" 
                :min="0"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="可空" width="80">
            <template #default="{ row }">
              <el-switch v-model="row.nullable" />
            </template>
          </el-table-column>
          <el-table-column label="主键" width="80">
            <template #default="{ row }">
              <el-switch v-model="row.primaryKey" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ $index }">
              <el-button 
                type="danger" 
                icon="el-icon-delete" 
                size="mini"
                @click="removeColumn($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-divider content-position="left">
          外键约束
          <el-button 
            type="text" 
            @click="addForeignKey"
            icon="el-icon-plus"
          >
            添加外键
          </el-button>
        </el-divider>

        <el-table 
          :data="tableForm.foreignKeys" 
          border 
          style="width: 100%"
        >
          <el-table-column label="列名" width="180">
            <template #default="{ row }">
              <el-select 
                v-model="row.column" 
                placeholder="选择列"
              >
                <el-option 
                  v-for="col in tableForm.columns" 
                  :key="col.name" 
                  :label="col.name" 
                  :value="col.name"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="引用表" width="200">
            <template #default="{ row }">
              <el-input 
                v-model="row.referenceTable" 
                placeholder="引用表名"
              />
            </template>
          </el-table-column>
          <el-table-column label="引用列" width="180">
            <template #default="{ row }">
              <el-input 
                v-model="row.referenceColumn" 
                placeholder="引用列名"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ $index }">
              <el-button 
                type="danger" 
                icon="el-icon-delete" 
                size="mini"
                @click="removeForeignKey($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>

    <el-dialog 
      title="生成 SQL" 
      v-model="sqlDialogVisible"
      width="70%"
    >
      <pre><code>{{ generatedSQL }}</code></pre>
      <template #footer>
        <el-button @click="sqlDialogVisible = false">关闭</el-button>
        <el-button 
          type="primary" 
          @click="copySQL"
        >
          复制
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  createTable, 
  updateTable, 
  getTableDetail, 
  generateTableSQL 
} from '@/api/tableDesigner'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  tableId: {
    type: String,
    default: null
  }
})

const isEditMode = computed(() => !!props.tableId)

const tableForm = reactive({
  name: '',
  databaseType: 'MySQL',
  description: '',
  columns: [],
  foreignKeys: []
})

const tableRules = {
  name: [
    { required: true, message: '请输入表名', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  databaseType: [
    { required: true, message: '请选择数据库类型', trigger: 'change' }
  ]
}

const databaseTypes = [
  'MySQL', 'PostgreSQL', 'SQLite', 
  'SQL Server', 'Oracle', 'MariaDB'
]

const columnTypes = [
  'INT', 'VARCHAR', 'TEXT', 
  'DATETIME', 'DECIMAL', 'BOOLEAN'
]

const saving = ref(false)
const sqlDialogVisible = ref(false)
const generatedSQL = ref('')

function addColumn() {
  tableForm.columns.push({
    name: '',
    type: 'VARCHAR',
    length: 255,
    nullable: true,
    primaryKey: false
  })
}

function removeColumn(index) {
  tableForm.columns.splice(index, 1)
}

function addForeignKey() {
  tableForm.foreignKeys.push({
    column: '',
    referenceTable: '',
    referenceColumn: ''
  })
}

function removeForeignKey(index) {
  tableForm.foreignKeys.splice(index, 1)
}

async function saveTable() {
  const formRef = tableFormRef.value
  if (!formRef) return

  try {
    await formRef.validate()
    saving.value = true

    const tableData = { ...tableForm }

    if (isEditMode.value) {
      await updateTable(props.tableId, tableData)
      ElMessage.success('表更新成功')
    } else {
      await createTable(tableData)
      ElMessage.success('表创建成功')
    }
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function generateSQL() {
  if (!props.tableId) {
    ElMessage.warning('请先保存表')
    return
  }

  try {
    const { sqlScript } = await generateTableSQL(props.tableId, {
      databaseType: tableForm.databaseType
    })
    generatedSQL.value = sqlScript
    sqlDialogVisible.value = true
  } catch (error) {
    ElMessage.error('生成 SQL 失败')
  }
}

function copySQL() {
  navigator.clipboard.writeText(generatedSQL.value)
  ElMessage.success('SQL 已复制')
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const { table } = await getTableDetail(props.tableId)
      Object.assign(tableForm, table)
    } catch (error) {
      ElMessage.error('加载表详情失败')
    }
  }
})
</script>

<style scoped>
.table-designer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.table-designer-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}
</style>
