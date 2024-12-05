<template>
  <div class="data-mapping-rule-preview">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="mapping-rule-editor">
          <template #header>
            <div class="card-header">
              <span>数据映射规则编辑器</span>
              <el-button-group>
                <el-button 
                  type="primary" 
                  @click="saveMappingConfig"
                  :loading="saving"
                >
                  <el-icon><Save /></el-icon> 保存配置
                </el-button>
                <el-button 
                  type="success" 
                  @click="previewMapping"
                >
                  <el-icon><View /></el-icon> 预览映射
                </el-button>
              </el-button-group>
            </div>
          </template>
          
          <DataMappingRuleEditor 
            ref="ruleEditorRef"
          />
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="mapping-preview-panel">
          <template #header>
            <span>映射预览</span>
          </template>
          
          <div v-if="previewResult" class="preview-result">
            <el-tabs v-model="activePreviewTab">
              <el-tab-pane label="类型映射" name="typeMapping">
                <el-table 
                  :data="previewResult.typeMappings" 
                  stripe 
                  style="width: 100%"
                >
                  <el-table-column prop="sourceType" label="源类型" />
                  <el-table-column prop="targetType" label="目标类型" />
                  <el-table-column prop="conversionScript" label="转换脚本">
                    <template #default="scope">
                      <el-tooltip 
                        effect="dark" 
                        :content="scope.row.conversionScript || '无'" 
                        placement="top"
                      >
                        <el-tag type="info">
                          {{ scope.row.conversionScript ? '查看脚本' : '无' }}
                        </el-tag>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              
              <el-tab-pane label="兼容性分析" name="compatibilityAnalysis">
                <el-alert 
                  v-if="previewResult.compatibilityIssues.length === 0"
                  title="未发现兼容性问题"
                  type="success"
                  :closable="false"
                />
                <el-table 
                  v-else
                  :data="previewResult.compatibilityIssues" 
                  stripe 
                  style="width: 100%"
                >
                  <el-table-column prop="sourceType" label="源类型" />
                  <el-table-column prop="targetType" label="目标类型" />
                  <el-table-column prop="issue" label="兼容性问题" />
                  <el-table-column prop="severity" label="严重程度">
                    <template #default="scope">
                      <el-tag 
                        :type="getSeverityType(scope.row.severity)"
                      >
                        {{ scope.row.severity }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
          
          <el-empty 
            v-else 
            description="请先编辑并预览映射规则"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Save, View } from '@element-plus/icons-vue'
import DataMappingRuleEditor from '@/components/DataMappingRuleEditor.vue'
import dataMappingApi from '@/api/dataMappingApi'

const ruleEditorRef = ref(null)
const previewResult = ref(null)
const activePreviewTab = ref('typeMapping')
const saving = ref(false)

const previewMapping = async () => {
  const mappingConfig = ruleEditorRef.value.getMappingConfig()
  
  if (!mappingConfig.sourceDatabase || !mappingConfig.targetDatabase) {
    ElMessage.warning('请选择源数据库和目标数据库')
    return
  }
  
  if (mappingConfig.mappingRules.length === 0) {
    ElMessage.warning('请添加映射规则')
    return
  }
  
  try {
    const response = await dataMappingApi.previewDataTypeMapping(mappingConfig)
    previewResult.value = response.data
    
    if (response.data.compatibilityIssues.length > 0) {
      ElMessage.warning('发现数据类型兼容性问题')
    }
  } catch (error) {
    ElMessage.error('预览映射失败：' + error.message)
  }
}

const saveMappingConfig = async () => {
  const mappingConfig = ruleEditorRef.value.getMappingConfig()
  
  if (!mappingConfig.sourceDatabase || !mappingConfig.targetDatabase) {
    ElMessage.warning('请选择源数据库和目标数据库')
    return
  }
  
  if (mappingConfig.mappingRules.length === 0) {
    ElMessage.warning('请添加映射规则')
    return
  }
  
  try {
    saving.value = true
    const response = await dataMappingApi.createMappingConfig(mappingConfig)
    
    ElMessageBox.confirm(
      '映射配置保存成功，是否立即查看详情？', 
      '保存成功', 
      {
        confirmButtonText: '查看详情',
        cancelButtonText: '继续编辑',
        type: 'success'
      }
    ).then(() => {
      // 跳转到详情页
    }).catch(() => {
      ruleEditorRef.value.resetMappingConfig()
    })
  } catch (error) {
    ElMessage.error('保存映射配置失败：' + error.message)
  } finally {
    saving.value = false
  }
}

const getSeverityType = (severity) => {
  switch (severity) {
    case '高': return 'danger'
    case '中': return 'warning'
    case '低': return 'info'
    default: return 'info'
  }
}
</script>

<style scoped>
.data-mapping-rule-preview {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-result {
  max-height: 500px;
  overflow-y: auto;
}
</style>
