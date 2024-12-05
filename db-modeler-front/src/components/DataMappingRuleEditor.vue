<template>
  <div class="data-mapping-rule-editor">
    <el-card class="mapping-rule-container">
      <template #header>
        <div class="card-header">
          <span>数据映射规则编辑器</span>
          <el-button-group>
            <el-button 
              type="primary" 
              size="small" 
              @click="addMappingRule"
            >
              <el-icon><Plus /></el-icon> 添加规则
            </el-button>
            <el-button 
              type="success" 
              size="small" 
              @click="previewMappingRules"
            >
              <el-icon><View /></el-icon> 预览
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-form 
        ref="ruleForm" 
        :model="mappingConfig" 
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="源数据库" prop="sourceDatabase">
              <el-select 
                v-model="mappingConfig.sourceDatabase" 
                placeholder="选择源数据库"
                @change="resetMappingRules"
              >
                <el-option 
                  v-for="db in supportedDatabases" 
                  :key="db" 
                  :label="db" 
                  :value="db"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标数据库" prop="targetDatabase">
              <el-select 
                v-model="mappingConfig.targetDatabase" 
                placeholder="选择目标数据库"
                @change="resetMappingRules"
              >
                <el-option 
                  v-for="db in supportedDatabases" 
                  :key="db" 
                  :label="db" 
                  :value="db"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">映射规则</el-divider>

        <transition-group name="rule-list" tag="div">
          <el-card 
            v-for="(rule, index) in mappingConfig.mappingRules" 
            :key="rule.id" 
            class="mapping-rule-card"
            shadow="hover"
          >
            <template #header>
              <div class="card-header">
                <span>规则 #{{ index + 1 }}</span>
                <el-button-group>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="removeMappingRule(index)"
                  >
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </el-button-group>
              </div>
            </template>

            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="源类型">
                  <el-select 
                    v-model="rule.sourceType" 
                    :placeholder="`选择 ${mappingConfig.sourceDatabase} 源类型`"
                  >
                    <el-option 
                      v-for="type in getSourceTypes()" 
                      :key="type" 
                      :label="type" 
                      :value="type"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="text-center">
                <el-icon><Right /></el-icon>
              </el-col>
              <el-col :span="10">
                <el-form-item label="目标类型">
                  <el-select 
                    v-model="rule.targetType" 
                    :placeholder="`选择 ${mappingConfig.targetDatabase} 目标类型`"
                  >
                    <el-option 
                      v-for="type in getTargetTypes()" 
                      :key="type" 
                      :label="type" 
                      :value="type"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="转换规则" v-if="rule.sourceType && rule.targetType">
              <el-input 
                v-model="rule.conversionScript" 
                type="textarea" 
                :rows="2" 
                placeholder="可选：输入自定义转换脚本"
              />
            </el-form-item>
          </el-card>
        </transition-group>
      </el-form>
    </el-card>

    <el-dialog 
      v-model="previewDialogVisible" 
      title="映射规则预览" 
      width="80%"
    >
      <pre>{{ previewContent }}</pre>
      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyPreview">复制</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { 
  ElMessage, 
  ElMessageBox 
} from 'element-plus'
import { 
  Plus, 
  Delete, 
  View, 
  Right 
} from '@element-plus/icons-vue'

const supportedDatabases = [
  'MySQL', 
  'PostgreSQL', 
  'SQLite', 
  'SQL Server', 
  'Oracle', 
  'MariaDB'
]

const databaseTypeMap = {
  'MySQL': ['INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'DECIMAL'],
  'PostgreSQL': ['INTEGER', 'VARCHAR', 'TEXT', 'DATE', 'TIMESTAMP', 'NUMERIC'],
  'SQLite': ['INTEGER', 'TEXT', 'REAL', 'BLOB', 'DATE'],
  'SQL Server': ['INT', 'NVARCHAR', 'TEXT', 'DATE', 'DATETIME2', 'DECIMAL'],
  'Oracle': ['NUMBER', 'VARCHAR2', 'CLOB', 'DATE', 'TIMESTAMP', 'DECIMAL'],
  'MariaDB': ['INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'DECIMAL']
}

const mappingConfig = reactive({
  sourceDatabase: null,
  targetDatabase: null,
  mappingRules: []
})

const ruleForm = ref(null)
const previewDialogVisible = ref(false)
const previewContent = ref('')

const addMappingRule = () => {
  if (!mappingConfig.sourceDatabase || !mappingConfig.targetDatabase) {
    ElMessage.warning('请先选择源数据库和目标数据库')
    return
  }

  const newRule = {
    id: Date.now(),
    sourceType: null,
    targetType: null,
    conversionScript: ''
  }
  mappingConfig.mappingRules.push(newRule)
}

const removeMappingRule = (index) => {
  ElMessageBox.confirm(
    '确定要删除此映射规则吗？', 
    '删除确认', 
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    mappingConfig.mappingRules.splice(index, 1)
    ElMessage.success('规则已删除')
  }).catch(() => {})
}

const resetMappingRules = () => {
  mappingConfig.mappingRules = []
}

const getSourceTypes = () => {
  return mappingConfig.sourceDatabase 
    ? databaseTypeMap[mappingConfig.sourceDatabase] 
    : []
}

const getTargetTypes = () => {
  return mappingConfig.targetDatabase 
    ? databaseTypeMap[mappingConfig.targetDatabase] 
    : []
}

const previewMappingRules = () => {
  if (mappingConfig.mappingRules.length === 0) {
    ElMessage.warning('请添加映射规则')
    return
  }

  previewContent.value = JSON.stringify(mappingConfig, null, 2)
  previewDialogVisible.value = true
}

const copyPreview = () => {
  navigator.clipboard.writeText(previewContent.value)
    .then(() => {
      ElMessage.success('预览内容已复制到剪贴板')
    })
    .catch(err => {
      ElMessage.error('复制失败：' + err)
    })
}

// 对外暴露方法和数据
defineExpose({
  getMappingConfig: () => mappingConfig,
  resetMappingConfig: () => {
    mappingConfig.sourceDatabase = null
    mappingConfig.targetDatabase = null
    mappingConfig.mappingRules = []
  }
})
</script>

<style scoped>
.data-mapping-rule-editor {
  width: 100%;
}

.mapping-rule-container {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mapping-rule-card {
  margin-bottom: 15px;
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rule-list-move,
.rule-list-enter-active,
.rule-list-leave-active {
  transition: all 0.5s ease;
}

.rule-list-enter-from,
.rule-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.rule-list-leave-active {
  position: absolute;
}
</style>
