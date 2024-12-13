<template>
  <div class="table-design">
    <div class="table-design-header">
      <a-breadcrumb>
        <a-breadcrumb-item>数据模型</a-breadcrumb-item>
        <a-breadcrumb-item>{{ table?.displayName || '未命名表' }}</a-breadcrumb-item>
      </a-breadcrumb>
      <a-space>
        <a-button type="primary" :loading="saving" @click="handleSave">保存</a-button>
      </a-space>
    </div>

    <div class="table-design-content" v-if="table">
      <div class="basic-info-section">
        <div class="section-header">
          <span class="section-title">基础信息</span>
          <a-button type="link" class="collapse-btn" @click="toggleBasicInfoPanel">
            {{ showBasicInfo ? '收起' : '展开' }}
          </a-button>
        </div>
        <div class="section-content" v-show="showBasicInfo">
          <a-form layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="表代码" required>
                  <a-input v-model:value="table.code" placeholder="请输入表代码" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="显示名称" required>
                  <a-input v-model:value="table.displayName" placeholder="请输入显示名称" />
                  <div class="error-message" v-if="!table.displayName">显示名称不能为空</div>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="所属主域">
                  <a-select v-model:value="table.domain" placeholder="请选择主域">
                    <a-select-option value="BUSINESS">业务域</a-select-option>
                    <a-select-option value="SYSTEM">系统域</a-select-option>
                    <a-select-option value="REFERENCE">参考域</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="存储引擎">
                  <a-select v-model:value="table.metadata.engine">
                    <a-select-option value="InnoDB">InnoDB</a-select-option>
                    <a-select-option value="MyISAM">MyISAM</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="字符集">
                  <a-select v-model:value="table.metadata.charset">
                    <a-select-option value="utf8mb4">utf8mb4</a-select-option>
                    <a-select-option value="utf8">utf8</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="排序规则">
                  <a-select v-model:value="table.metadata.collate">
                    <a-select-option value="utf8mb4_general_ci">utf8mb4_general_ci</a-select-option>
                    <a-select-option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="表说明">
              <a-textarea 
                v-model:value="table.comment" 
                placeholder="请输入表的详细说明，包括用途、业务场景等信息"
                :rows="3"
                :maxLength="500"
                show-count
              />
            </a-form-item>
          </a-form>
        </div>
      </div>

      <div class="field-design-section">
        <div class="section-header">
          <span class="section-title">字段设计</span>
          <a-space>
            <a-button type="primary" @click="addField">添加字段</a-button>
            <a-button @click="copyField" :disabled="!selectedFields.length">复制</a-button>
            <a-button @click="deleteField" :disabled="!selectedFields.length">删除</a-button>
          </a-space>
        </div>
        <field-list 
          v-model:fields="table.fields"
          :selectedFields="selectedFields"
          @select="handleFieldSelect"
        />
      </div>
    </div>

    <div v-else class="loading-state">
      <a-spin v-if="isLoading" size="large" />
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.table-design {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  
  .table-design-header {
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-design-content {
    flex: 1;
    padding: 16px 24px;
    overflow-y: auto;

    .basic-info-section {
      background: #fff;
      border-radius: 2px;
      border: 1px solid #f0f0f0;
      margin-bottom: 16px;

      .section-header {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .section-title {
          font-size: 14px;
          font-weight: 500;
          color: #000000d9;
        }

        .collapse-btn {
          padding: 0;
          height: auto;
        }
      }

      .section-content {
        padding: 16px;
      }
    }

    .field-design-section {
      background: #fff;
      border-radius: 2px;
      border: 1px solid #f0f0f0;

      .section-header {
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .section-title {
          font-size: 14px;
          font-weight: 500;
          color: #000000d9;
        }
      }
    }

    .error-message {
      color: #ff4d4f;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .loading-state {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .error-message {
      color: #ff4d4f;
      text-align: center;
    }
  }
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { tableApi } from '@/api/table'
import type { Table } from '@/types/table'
import pinyin from 'pinyin'
import useTableDesign from '@/composables/useTableDesign'
import FieldList from './components/FieldList.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 组件状态
const { 
  table, 
  loading: isLoading, 
  saving,
  error,
  loadTableDesign,
  saveTableDesign
} = useTableDesign()

const showBasicInfo = ref(true)
const selectedFields = ref<string[]>([])

// 监听路由参数变化
watch(
  () => route.params.tableId,
  async (newId) => {
    if (newId) {
      await loadTableDesign(newId as string)
    }
  },
  { immediate: true }
)

// 方法定义
const handleSave = async () => {
  if (!table.value) return
  
  try {
    await saveTableDesign(table.value)
    message.success('保存成功')
  } catch (err) {
    message.error('保存失败')
  }
}

const handleFieldSelect = (selected: string[]) => {
  selectedFields.value = selected
}

const addField = () => {
  if (!table.value) return
  
  const newField = {
    id: Date.now().toString(),
    name: '',
    displayName: '',
    dataType: 'VARCHAR',
    length: 255,
    precision: 0,
    scale: 0,
    nullable: true,
    primaryKey: false,
    autoIncrement: false,
    unsigned: false,
    zerofill: false,
    binary: false,
    comment: '',
    position: table.value.fields?.length || 0
  }
  
  table.value.fields = [...(table.value.fields || []), newField]
}

const copyField = () => {
  if (!table.value || !selectedFields.value.length) return
  
  const newFields = selectedFields.value.map(id => {
    const field = table.value!.fields.find(f => f.id === id)
    if (!field) return null
    
    const copy = cloneDeep(field)
    copy.id = Date.now().toString()
    copy.name = `${copy.name}_copy`
    copy.displayName = `${copy.displayName}_复制`
    copy.position = table.value!.fields.length
    return copy
  }).filter(Boolean)
  
  table.value.fields = [...table.value.fields, ...newFields]
  selectedFields.value = []
}

const deleteField = () => {
  if (!table.value || !selectedFields.value.length) return
  
  table.value.fields = table.value.fields.filter(
    field => !selectedFields.value.includes(field.id)
  )
  selectedFields.value = []
}

const toggleBasicInfoPanel = () => {
  showBasicInfo.value = !showBasicInfo.value
}
</script>

