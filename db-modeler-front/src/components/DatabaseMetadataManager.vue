<template>
  <div class="database-metadata-manager">
    <el-card class="metadata-card">
      <template #header>
        <div class="card-header">
          <span>数据库元数据管理</span>
        </div>
      </template>

      <el-form 
        ref="metadataFormRef"
        :model="metadataForm" 
        label-width="120px"
      >
        <el-form-item label="数据库连接" prop="connectionId">
          <el-select 
            v-model="metadataForm.connectionId" 
            placeholder="选择数据库连接"
            @change="loadProjectConnections"
          >
            <el-option 
              v-for="connection in databaseConnections" 
              :key="connection.id" 
              :value="connection.id"
            >
              {{ connection.name }} ({{ connection.type }})
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="目标项目" prop="projectId">
          <el-select 
            v-model="metadataForm.projectId" 
            placeholder="选择目标项目"
          >
            <el-option 
              v-for="project in projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ project.name }}
            </el-option>
          </el-select>
        </el-form-item>

        <div class="metadata-extraction-actions">
          <el-button-group>
            <el-button 
              type="primary" 
              @click="extractViews"
              :loading="extracting.views"
            >
              提取视图
            </el-button>
            <el-button 
              type="success" 
              @click="extractRoutines"
              :loading="extracting.routines"
            >
              提取存储过程
            </el-button>
            <el-button 
              type="warning" 
              @click="extractForeignKeys"
              :loading="extracting.foreignKeys"
            >
              提取外键
            </el-button>
            <el-button 
              type="danger" 
              @click="extractTriggers"
              :loading="extracting.triggers"
            >
              提取触发器
            </el-button>
          </el-button-group>
        </div>
      </el-form>

      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="视图" name="views">
          <el-table 
            :data="extractedMetadata.views" 
            style="width: 100%" 
            border
          >
            <el-table-column label="视图名" prop="name" width="200" />
            <el-table-column label="定义" prop="definition" width="400" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="viewMetadataDetails(row, 'view')"
                  >
                    查看详情
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="存储过程/函数" name="routines">
          <el-table 
            :data="extractedMetadata.routines" 
            style="width: 100%" 
            border
          >
            <el-table-column label="名称" prop="name" width="200" />
            <el-table-column label="类型" prop="type" width="100" />
            <el-table-column label="定义" prop="definition" width="400" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="viewMetadataDetails(row, 'routine')"
                  >
                    查看详情
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="外键约束" name="foreignKeys">
          <el-table 
            :data="extractedMetadata.foreignKeys" 
            style="width: 100%" 
            border
          >
            <el-table-column label="约束名" prop="name" width="200" />
            <el-table-column label="源表" prop="sourceTable" width="150" />
            <el-table-column label="源列" prop="sourceColumn" width="150" />
            <el-table-column label="目标表" prop="targetTable" width="150" />
            <el-table-column label="目标列" prop="targetColumn" width="150" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="viewMetadataDetails(row, 'foreignKey')"
                  >
                    查看详情
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="触发器" name="triggers">
          <el-table 
            :data="extractedMetadata.triggers" 
            style="width: 100%" 
            border
          >
            <el-table-column label="触发器名" prop="name" width="200" />
            <el-table-column label="表" prop="table" width="150" />
            <el-table-column label="时机" prop="timing" width="100" />
            <el-table-column label="事件" prop="event" width="100" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="viewMetadataDetails(row, 'trigger')"
                  >
                    查看详情
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog 
      v-model="metadataDetailsDialogVisible" 
      :title="selectedMetadata.name + ' 详情'" 
      width="80%"
    >
      <pre>{{ JSON.stringify(selectedMetadata, null, 2) }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  extractViews, 
  extractRoutines,
  extractForeignKeys,
  extractTriggers,
  synchronizeMetadata,
  generateMetadataSyncScript
} from '@/api/databaseMetadata'
import { listDatabaseConnections } from '@/api/databaseConnection'
import { listProjects } from '@/api/project'

const metadataFormRef = ref(null)
const databaseConnections = ref([])
const projects = ref([])
const activeTab = ref('views')

const metadataForm = reactive({
  connectionId: null,
  projectId: null
})

const extracting = reactive({
  views: false,
  routines: false,
  foreignKeys: false,
  triggers: false
})

const extractedMetadata = reactive({
  views: [],
  routines: [],
  foreignKeys: [],
  triggers: []
})

const metadataDetailsDialogVisible = ref(false)
const selectedMetadata = ref({})

const loadProjectConnections = async () => {
  try {
    const connectionsResponse = await listDatabaseConnections()
    databaseConnections.value = connectionsResponse.connections

    const projectsResponse = await listProjects()
    projects.value = projectsResponse.projects
  } catch (error) {
    ElMessage.error('加载数据库连接和项目失败')
  }
}

const extractViews = async () => {
  try {
    extracting.views = true
    const response = await extractViews(
      metadataForm.connectionId, 
      { projectId: metadataForm.projectId }
    )
    extractedMetadata.views = response.views
    ElMessage.success('视图提取成功')
  } catch (error) {
    ElMessage.error('提取视图失败')
  } finally {
    extracting.views = false
  }
}

const extractRoutines = async () => {
  try {
    extracting.routines = true
    const response = await extractRoutines(
      metadataForm.connectionId, 
      { projectId: metadataForm.projectId }
    )
    extractedMetadata.routines = response.routines
    ElMessage.success('存储过程提取成功')
  } catch (error) {
    ElMessage.error('提取存储过程失败')
  } finally {
    extracting.routines = false
  }
}

const extractForeignKeys = async () => {
  try {
    extracting.foreignKeys = true
    const response = await extractForeignKeys(
      metadataForm.connectionId, 
      { projectId: metadataForm.projectId }
    )
    extractedMetadata.foreignKeys = response.foreignKeys
    ElMessage.success('外键约束提取成功')
  } catch (error) {
    ElMessage.error('提取外键约束失败')
  } finally {
    extracting.foreignKeys = false
  }
}

const extractTriggers = async () => {
  try {
    extracting.triggers = true
    const response = await extractTriggers(
      metadataForm.connectionId, 
      { projectId: metadataForm.projectId }
    )
    extractedMetadata.triggers = response.triggers
    ElMessage.success('触发器提取成功')
  } catch (error) {
    ElMessage.error('提取触发器失败')
  } finally {
    extracting.triggers = false
  }
}

const viewMetadataDetails = (metadata, type) => {
  selectedMetadata.value = metadata
  metadataDetailsDialogVisible.value = true
}

const synchronizeSelectedMetadata = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请选择目标数据库类型', '同步元数据', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^(mysql|postgresql|sqlite|sqlserver|oracle)$/,
      inputErrorMessage: '请输入有效的数据库类型'
    })

    const metadataIds = [
      ...extractedMetadata.views.map(v => v.id),
      ...extractedMetadata.routines.map(r => r.id),
      ...extractedMetadata.foreignKeys.map(fk => fk.id),
      ...extractedMetadata.triggers.map(t => t.id)
    ]

    const response = await synchronizeMetadata(
      metadataForm.connectionId, 
      { 
        metadataIds,
        targetDatabaseType: value
      }
    )

    const successCount = response.syncResults.filter(r => r.success).length
    const failedCount = response.syncResults.length - successCount

    ElMessage.success(`元数据同步完成。成功：${successCount}，失败：${failedCount}`)
  } catch (error) {
    ElMessage.error('元数据同步失败')
  }
}

const generateSyncScript = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请选择目标数据库类型', '生成同步脚本', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^(mysql|postgresql|sqlite|sqlserver|oracle)$/,
      inputErrorMessage: '请输入有效的数据库类型'
    })

    const metadataIds = [
      ...extractedMetadata.views.map(v => v.id),
      ...extractedMetadata.routines.map(r => r.id),
      ...extractedMetadata.foreignKeys.map(fk => fk.id),
      ...extractedMetadata.triggers.map(t => t.id)
    ]

    const response = await generateMetadataSyncScript({
      metadataIds,
      targetDatabaseType: value
    })

    const syncScripts = response.syncScripts.map(
      script => `-- ${script.name} (${script.type})\n${script.createSQL}\n\n${script.alterSQL}`
    ).join('\n\n')

    await ElMessageBox.alert(
      `<pre>${syncScripts}</pre>`, 
      '元数据同步脚本', 
      { 
        dangerouslyUseHTMLString: true,
        confirmButtonText: '复制脚本'
      }
    )

    navigator.clipboard.writeText(syncScripts)
  } catch (error) {
    ElMessage.error('生成同步脚本失败')
  }
}

onMounted(loadProjectConnections)
</script>

<style scoped>
.database-metadata-manager {
  width: 100%;
}

.metadata-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metadata-extraction-actions {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

pre {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
