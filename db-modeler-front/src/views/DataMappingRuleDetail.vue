<template>
  <div class="data-mapping-rule-detail" v-loading="loading">
    <el-card v-if="mappingRule">
      <template #header>
        <div class="card-header">
          <span>映射规则详情：{{ mappingRule.name }}</span>
          <el-button-group>
            <el-button 
              type="primary" 
              @click="handleEdit"
              :icon="Edit"
            >
              编辑规则
            </el-button>
            <el-button 
              type="warning" 
              @click="handleArchive"
              :icon="Archive"
              v-if="mappingRule.status !== 'archived'"
            >
              归档
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-descriptions 
            title="基本信息" 
            :column="1" 
            border
          >
            <el-descriptions-item label="规则名称">
              {{ mappingRule.name }}
            </el-descriptions-item>
            <el-descriptions-item label="源数据库">
              <el-tag>{{ mappingRule.sourceDatabase }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="目标数据库">
              <el-tag type="success">{{ mappingRule.targetDatabase }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(mappingRule.status)">
                {{ statusLabels[mappingRule.status] }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(mappingRule.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="最后更新">
              {{ formatDate(mappingRule.updatedAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>

        <el-col :span="12">
          <el-card class="mapping-rules-card">
            <template #header>
              <span>映射规则详情</span>
            </template>
            
            <el-table 
              :data="mappingRule.mappingRules" 
              stripe 
              style="width: 100%"
            >
              <el-table-column 
                prop="sourceType" 
                label="源类型" 
                width="150"
              />
              <el-table-column 
                prop="targetType" 
                label="目标类型" 
                width="150"
              />
              <el-table-column 
                prop="conversionScript" 
                label="转换脚本"
              >
                <template #default="{ row }">
                  <el-tooltip 
                    effect="dark" 
                    :content="row.conversionScript || '无'" 
                    placement="top"
                  >
                    <el-tag type="info">
                      {{ row.conversionScript ? '查看脚本' : '无' }}
                    </el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="left">兼容性分析</el-divider>

      <el-result 
        v-if="compatibilityAnalysis" 
        :icon="getCompatibilityIcon()"
        :title="getCompatibilityTitle()"
        :sub-title="getCompatibilitySubtitle()"
      >
        <template #extra>
          <el-button 
            type="primary" 
            @click="showDetailedAnalysis"
          >
            查看详细分析
          </el-button>
        </template>
      </el-result>

      <el-dialog 
        v-model="compatibilityDialogVisible" 
        title="映射规则兼容性详细分析" 
        width="80%"
      >
        <el-table 
          :data="compatibilityAnalysis.issues" 
          stripe 
          style="width: 100%"
        >
          <el-table-column 
            prop="sourceType" 
            label="源类型" 
            width="150"
          />
          <el-table-column 
            prop="targetType" 
            label="目标类型" 
            width="150"
          />
          <el-table-column 
            prop="issue" 
            label="兼容性问题" 
            width="300"
          />
          <el-table-column 
            prop="severity" 
            label="严重程度"
          >
            <template #default="{ row }">
              <el-tag :type="getSeverityType(row.severity)">
                {{ row.severity }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  ElMessage, 
  ElMessageBox 
} from 'element-plus'
import { 
  Edit, 
  Archive 
} from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import dataMappingApi from '@/api/dataMappingApi'
import { formatDate } from '@/utils/dateUtils'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const mappingRule = ref(null)
const compatibilityAnalysis = ref(null)
const compatibilityDialogVisible = ref(false)

const statusLabels = {
  'draft': '草稿',
  'active': '活跃',
  'archived': '已归档'
}

const fetchMappingRuleDetail = async () => {
  loading.value = true
  try {
    const response = await dataMappingApi.getMappingConfigById(route.params.id)
    mappingRule.value = response.data
    
    // 获取兼容性分析
    const compatibilityResponse = await dataMappingApi.previewDataTypeMapping(mappingRule.value)
    compatibilityAnalysis.value = compatibilityResponse.data
  } catch (error) {
    ElMessage.error('获取映射规则详情失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/data-mapping/rules/edit/${route.params.id}`)
}

const handleArchive = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要归档此映射规则吗？归档后规则将不再可用。', 
      '归档确认', 
      {
        confirmButtonText: '确定归档',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await dataMappingApi.updateMappingConfig(route.params.id, { status: 'archived' })
    ElMessage.success('映射规则已归档')
    fetchMappingRuleDetail()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('归档映射规则失败：' + error.message)
    }
  }
}

const getStatusType = (status) => {
  const statusTypeMap = {
    'draft': 'info',
    'active': 'success',
    'archived': 'warning'
  }
  return statusTypeMap[status] || 'info'
}

const getCompatibilityIcon = () => {
  if (!compatibilityAnalysis.value) return 'info'
  
  const hasHighSeverityIssues = compatibilityAnalysis.value.issues.some(
    issue => issue.severity === '高'
  )
  
  return hasHighSeverityIssues ? 'warning' : 'success'
}

const getCompatibilityTitle = () => {
  if (!compatibilityAnalysis.value) return '未进行兼容性分析'
  
  const hasHighSeverityIssues = compatibilityAnalysis.value.issues.some(
    issue => issue.severity === '高'
  )
  
  return hasHighSeverityIssues 
    ? '存在严重的兼容性问题' 
    : '映射规则兼容性良好'
}

const getCompatibilitySubtitle = () => {
  if (!compatibilityAnalysis.value) return '请点击查看详细分析'
  
  const issueCount = compatibilityAnalysis.value.issues.length
  const highSeverityCount = compatibilityAnalysis.value.issues.filter(
    issue => issue.severity === '高'
  ).length
  
  return `共发现 ${issueCount} 个兼容性问题，其中 ${highSeverityCount} 个为高严重程度`
}

const showDetailedAnalysis = () => {
  compatibilityDialogVisible.value = true
}

const getSeverityType = (severity) => {
  switch (severity) {
    case '高': return 'danger'
    case '中': return 'warning'
    case '低': return 'info'
    default: return 'info'
  }
}

onMounted(() => {
  fetchMappingRuleDetail()
})
</script>

<style scoped>
.data-mapping-rule-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mapping-rules-card {
  margin-bottom: 20px;
}
</style>
