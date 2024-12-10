<template>
  <div class="field-template-selector">
    <a-modal
      :visible="props.modelValue"
      title="选择字段模板"
      width="800px"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="select" tab="选择模板">
          <div class="template-selector">
            <div class="template-toolbar">
              <a-space>
                <a-radio-group
                  v-model:value="selectedCategory"
                  :options="categories"
                  @change="handleCategoryChange"
                />
                <a-button type="primary" @click="showTemplateForm = true">
                  <template #icon><plus-outlined /></template>
                  新增模板
                </a-button>
                <a-button type="danger" @click="handleBatchDelete">
                  批量删除
                </a-button>
                <a-button @click="showTagManage = true">
                  标签管理
                </a-button>
                <a-button @click="showCategoryManage = true">
                  分类管理
                </a-button>
              </a-space>
              
              <a-input-search
                v-model:value="searchText"
                placeholder="搜索模板"
                @search="handleSearch"
              />
            </div>

            <template-list
              v-if="!isGroupMode"
              :templates="filteredTemplates"
              :selected-keys="selectedTemplates"
              @select="handleTemplateSelect"
              @preview="handlePreview"
              @edit="handleEdit"
              @delete="handleDelete"
              @copy="handleCopy"
            />

            <GroupList
              v-if="isGroupMode"
              :groups="displayGroups"
              :selected-keys="selectedGroups"
              @select="handleGroupSelect"
              @edit="handleEditGroup"
              @delete="handleDeleteGroup"
            />
          </div>
        </a-tab-pane>

        <a-tab-pane key="preview" tab="预览选中">
          <preview-list
            :fields="selectedPreviewFields"
            @remove="handleRemoveField"
          />
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <a-modal
      v-model:visible="showTemplateForm"
      title="新增字段模板"
      width="600px"
      :maskClosable="false"
      @ok="handleTemplateSubmit"
      @cancel="handleTemplateCancel"
    >
      <a-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="模板名称" name="name">
          <a-input 
            v-model:value="templateForm.name" 
            placeholder="请输入模板名称"
            :maxLength="50"
            show-count
          />
        </a-form-item>

        <a-form-item label="字段名" name="fieldName">
          <a-input 
            v-model:value="templateForm.fieldName" 
            placeholder="请输入字段名，只能包含字母、数字和下划线"
            :maxLength="64"
            show-count
          />
        </a-form-item>

        <a-form-item 
          label="数据类型" 
          name="dataType"
          :help="dataTypeHint"
        >
          <a-select
            v-model:value="templateForm.dataType"
            placeholder="请选择数据类型"
            @change="handleTemplateDataTypeChange"
            :options="dataTypeOptions"
          />
        </a-form-item>

        <a-form-item 
          v-if="showTemplateLength" 
          label="长度" 
          name="length"
          :help="templateForm.dataType === 'decimal' ? '整数位数' : '字段长度'"
        >
          <a-input-number
            v-model:value="templateForm.length"
            :min="1"
            :max="currentTemplateDataType?.maxLength"
            style="width: 100%"
            placeholder="请输入长度"
          />
          <template #extra>
            <span v-if="currentTemplateDataType?.maxLength">
              最大允许长度: {{ currentTemplateDataType.maxLength }}
            </span>
          </template>
        </a-form-item>

        <a-form-item 
          v-if="showTemplatePrecision" 
          label="小数位数" 
          name="precision"
          help="小数点后的位数，必须小于字段长度"
        >
          <a-input-number
            v-model:value="templateForm.precision"
            :min="0"
            :max="templateForm.length ? templateForm.length - 1 : undefined"
            style="width: 100%"
            placeholder="请输入小数位数"
          />
        </a-form-item>

        <a-form-item label="默认值" name="defaultValue">
          <a-input 
            v-model:value="templateForm.defaultValue" 
            placeholder="请输入默认值"
          />
        </a-form-item>

        <a-form-item label="可空" name="nullable">
          <a-switch v-model:checked="templateForm.nullable" />
        </a-form-item>

        <a-form-item label="主键" name="primaryKey">
          <a-switch 
            v-model:checked="templateForm.primaryKey"
            @change="handlePrimaryKeyChange"
          />
        </a-form-item>

        <a-form-item 
          v-if="templateForm.primaryKey" 
          label="自增" 
          name="autoIncrement"
        >
          <a-switch 
            v-model:checked="templateForm.autoIncrement"
            :disabled="!['int', 'bigint'].includes(templateForm.dataType)"
          />
        </a-form-item>

        <a-form-item label="备注" name="comment">
          <a-textarea 
            v-model:value="templateForm.comment" 
            placeholder="请输入备注信息"
            :rows="3"
            :maxLength="200"
            show-count
          />
        </a-form-item>

        <a-form-item label="分类" name="category">
          <a-select
            v-model:value="templateForm.category"
            :options="categories"
            placeholder="请选择分类"
            allow-clear
          />
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="templateForm.tags"
            mode="tags"
            placeholder="请输入标签，回车确认"
            :options="[]"
            :maxTagCount="5"
            :maxTagTextLength="20"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="showTagManage"
      title="标签管理"
      @ok="handleUpdateTags"
      @cancel="handleCancel"
    >
      <TagManageModal
        :templates="fieldTemplates"
        @update-tags="handleUpdateTags"
      />
    </a-modal>

    <a-modal
      v-model:visible="showCategoryManage"
      title="分类管理"
      @ok="handleUpdateCategories"
      @cancel="handleCancel"
    >
      <CategoryManageModal
        :categories="categories"
        @update="handleUpdateCategories"
      />
    </a-modal>

    <a-modal
      v-model:visible="showGroupModal"
      title="组管理"
      @ok="handleGroupSubmit"
      @cancel="handleCancel"
    >
      <GroupFormModal
        :group="editingGroup"
        :templates="fieldTemplates"
        @submit="handleGroupSubmit"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTemplateStore } from '@/stores/template';
import { message } from 'ant-design-vue';
import type { Template, Tag } from './types';
import { PlusOutlined } from '@ant-design/icons-vue';
import { v4 as uuidv4 } from 'uuid';
import TemplateList from './template-selector/TemplateList.vue';
import PreviewList from './template-selector/PreviewList.vue';
import GroupList from './template-selector/GroupList.vue';
import TagManageModal from './template-selector/TagManageModal.vue';
import CategoryManageModal from './template-selector/CategoryManageModal.vue';
import GroupFormModal from './template-selector/GroupFormModal.vue';
import { DATABASE_TYPES } from '@/config/database';
import { createTemplate, getTemplates, deleteTemplate, updateTemplate } from '@/api/template';
import type { FieldTemplate } from '@/api/template';
import { TemplateCategory } from '@/api/template';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', fields: any[]): void;
}>();

const templateStore = useTemplateStore();
const activeTab = ref('select');
const searchText = ref('');
const selectedCategory = ref('ALL');
const showTemplateForm = ref(false);
const categories = ref([
  { label: '全部', value: 'ALL' },
  { label: '基础字段', value: 'BASIC' },
  { label: '业务字段', value: 'BUSINESS' },
  { label: '系统字段', value: 'SYSTEM' }
]);
const templateForm = ref({
  name: '',
  fieldName: '',
  dataType: undefined,
  length: undefined,
  precision: undefined,
  scale: undefined,
  nullable: true,
  primaryKey: false,
  autoIncrement: false,
  defaultValue: '',
  comment: '',
  category: undefined,
  tags: []
});
const templateFormRef = ref();
const showTagManage = ref(false);
const showCategoryManage = ref(false);
const showGroupModal = ref(false);
const editingGroup = ref(null);
const isGroupMode = ref(false);
const selectedGroups = ref<string[]>([]);
const displayGroups = ref<any[]>([]);
const selectedTemplates = ref<string[]>([]);
const selectedPreviewFields = ref<any[]>([]);

const dataTypeOptions = [
  { label: 'VARCHAR - 可变长度字符串', value: 'varchar', maxLength: 65535 },
  { label: 'CHAR - 固定长度字符串', value: 'char', maxLength: 255 },
  { label: 'TEXT - 长文本', value: 'text' },
  { label: 'INT - 整数', value: 'int', autoIncrement: true },
  { label: 'BIGINT - 长整数', value: 'bigint', autoIncrement: true },
  { label: 'DECIMAL - 定点数', value: 'decimal', maxLength: 65, precision: true },
  { label: 'DATETIME - 日期时间', value: 'datetime' },
  { label: 'DATE - 日期', value: 'date' },
  { label: 'TIME - 时间', value: 'time' },
  { label: 'BOOLEAN - 布尔值', value: 'boolean' }
];

// 先定义验证函数
const validateLength = (_rule: any, value: any) => {
  const config = getDataTypeConfig(templateForm.value.dataType);
  if (!config?.maxLength) return Promise.resolve();
  if (!value && value !== 0) return Promise.reject('请输入长度');
  if (value <= 0) return Promise.reject('长度必须大于0');
  if (value > config.maxLength) return Promise.reject(`长度不能超过 ${config.maxLength}`);
  return Promise.resolve();
};

const validatePrecision = (_rule: any, value: any) => {
  const config = getDataTypeConfig(templateForm.value.dataType);
  if (!config?.precision) return Promise.resolve();
  if (!value && value !== 0) return Promise.reject('请输入精度');
  if (value < 0) return Promise.reject('精度不能小于0');
  if (value >= templateForm.value.length) return Promise.reject('精度必须小于长度');
  return Promise.resolve();
};

// 然后定义验证规则
const templateRules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { max: 50, message: '模板名称不能超过50个字符', trigger: 'blur' }
  ],
  fieldName: [
    { required: true, message: '请输入字段名', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头', trigger: 'blur' }
  ],
  dataType: [
    { required: true, message: '请选择数据类型', trigger: 'change' }
  ],
  length: [
    { validator: validateLength, trigger: 'change' }
  ],
  precision: [
    { validator: validatePrecision, trigger: 'change' }
  ]
};

// 计算属性
const filteredTemplates = computed(() => {
  let templates = templateStore.templates;
  
  // 按分类筛选
  if (selectedCategory.value !== 'ALL') {
    templates = templates.filter(t => t.category === selectedCategory.value);
  }
  
  // 按搜索文本筛选
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    templates = templates.filter(t => 
      t.name.toLowerCase().includes(searchLower) ||
      t.fieldName.toLowerCase().includes(searchLower) ||
      t.comment?.toLowerCase().includes(searchLower)
    );
  }
  
  return templates;
});

// 添加初始化函数
const initCategories = async () => {
  try {
    // 如果需要从后端获取分类数据，可以在这里添加 API 调用
    // const response = await api.getCategories()
    // categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
    message.error('加载分类数据失败')
  }
}

// 生命周期钩子
onMounted(async () => {
  try {
    await templateStore.loadTemplates();
  } catch (error) {
    message.error('加载模板失败');
  }
  initCategories()
});

// 方法
const handleTemplateSelect = (templates: FieldTemplate[]) => {
  // 处理批量选择
  templates.forEach(template => {
    const selectedField = createSelectedField(template);
    selectedPreviewFields.value.push(selectedField);
  });
};

const handlePreview = async (template: Template) => {
  try {
    activeTab.value = 'preview';
    if (!selectedTemplates.value.includes(template.id)) {
      handleTemplateSelect(template);
    }
  } catch (error) {
    console.error('预览模板失败:', error);
    message.error('预览模板失败');
  }
};

const handleRemoveField = (index: number) => {
  selectedPreviewFields.value.splice(index, 1);
};

const handleConfirm = () => {
  if (selectedPreviewFields.value.length === 0) {
    message.warning('请至少选择一个字段模板');
    return;
  }

  emit('select', selectedPreviewFields.value);
  emit('update:modelValue', false);
  selectedPreviewFields.value = [];
};

const handleCancel = () => {
  emit('update:modelValue', false);
  selectedTemplates.value = [];
  selectedPreviewFields.value = [];
  activeTab.value = 'select';
  showTemplateForm.value = false;
  resetForm();
};

const resetForm = () => {
  if (templateFormRef.value) {
    templateFormRef.value.resetFields();
  }
  templateForm.value = {
    name: '',
    fieldName: '',
    dataType: undefined,
    length: undefined,
    precision: undefined,
    scale: undefined,
    nullable: true,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: '',
    comment: '',
    category: undefined,
    tags: []
  };
};

// 加载模板列表
const loadTemplates = async () => {
  try {
    await templateStore.loadTemplates()
  } catch (error) {
    console.error('加载模板失败:', error)
    message.error('加载模板失败')
  }
}

// 处理模板提交
const handleTemplateSubmit = async () => {
  try {
    await templateFormRef.value?.validate()
    
    // 如果选择了"全部"分类，设置为 null
    const formData = { ...templateForm.value }
    if (formData.category === 'ALL') {
      formData.category = null
    }
    
    const response = await createTemplate(formData)
    if (response?.data) {
      message.success('创建成功')
      showTemplateForm.value = false
      // 重置表单
      templateForm.value = {
        name: '',
        fieldName: '',
        dataType: undefined,
        length: undefined,
        precision: undefined,
        nullable: true,
        primaryKey: false,
        autoIncrement: false,
        defaultValue: '',
        comment: '',
        category: undefined,
        tags: []
      }
      // 刷新模板列表
      await templateStore.loadTemplates()
    } else {
      throw new Error('创建失败')
    }
  } catch (error: any) {
    console.error('创建模板失败:', error)
    message.error(error.message || '创建失败')
  }
}

// 初始化加载
onMounted(async () => {
  await loadTemplates()
})

const handleEdit = async (template: Template) => {
  try {
    templateForm.value = {
      ...template,
      ...template.template,
      category: template.category?.id
    };
    showTemplateForm.value = true;
  } catch (error) {
    console.error('编辑模板失败:', error);
    message.error('编辑模板失败');
  }
};

const handleDelete = async (template: Template) => {
  try {
    await deleteTemplate(template.id);
    await templateStore.loadTemplates();
    message.success('删除成功');
  } catch (error) {
    console.error('删除模板失败:', error);
    message.error('删除模板失败');
  }
};

const handleBatchDelete = async () => {
  if (selectedTemplates.value.length === 0) {
    message.warning('请先选择要删除的模板');
    return;
  }

  try {
    for (const templateId of selectedTemplates.value) {
      await templateStore.deleteTemplate(templateId);
    }
    message.success('批量删除成功');
    selectedTemplates.value = [];
    selectedPreviewFields.value = [];
  } catch (error) {
    message.error('批量删除失败');
  }
};

const handleCategoryChange = (value: string) => {
  selectedCategory.value = value
  if (value === 'ALL') {
    // 显示所有模板
    return
  }
  // 按分类筛选模板
}

const handleSearch = (value: string) => {
  searchText.value = value;
};

// 标签管理相关
const handleUpdateTags = (updatedTags: Tag[]) => {
  // TODO: 更新标签
  message.success('标签更新成功');
  showTagManage.value = false;
};

// 分类管理相关
const handleUpdateCategories = (updatedCategories: string[]) => {
  // TODO: 更新分类
  message.success('分类更新成功');
  showCategoryManage.value = false;
};

// 组管理相关
const handleGroupSubmit = (group: any) => {
  // TODO: 保存组
  message.success('组保存成功');
  showGroupModal.value = false;
};

const handleGroupSelect = (groupId: string) => {
  // TODO: 选择组
};

const handleEditGroup = (group: any) => {
  editingGroup.value = group;
  showGroupModal.value = true;
};

const handleDeleteGroup = async (groupId: string) => {
  // TODO: 删除组
  message.success('组删除成功');
};

const handleCopy = async (template: Template) => {
  try {
    const newTemplate = {
      ...template,
      name: `${template.name}_复制`,
      fieldName: `${template.fieldName}_copy`
    };
    delete newTemplate.id;
    delete newTemplate.createTime;
    
    await createTemplate(newTemplate);
    await templateStore.loadTemplates();
    message.success('复制成功');
  } catch (error) {
    console.error('复制模板失败:', error);
    message.error('复制模板失败');
  }
};

// 修改数据类型变更处理函数
const handleTemplateDataTypeChange = (value: string) => {
  const config = getDataTypeConfig(value);
  if (!config) return;

  // 重置字段值
  templateForm.value.length = undefined;
  templateForm.value.precision = undefined;
  templateForm.value.autoIncrement = false;

  // 设置默认值
  if (config.maxLength) {
    if (value === 'varchar') {
      templateForm.value.length = 255;
    } else if (value === 'char') {
      templateForm.value.length = 1;
    } else if (value === 'decimal') {
      templateForm.value.length = 10;
      templateForm.value.precision = 2;
    }
  }

  // 处理自增
  if (templateForm.value.primaryKey && !config.autoIncrement) {
    templateForm.value.autoIncrement = false;
  }
};

// 修改长度显示控制
const showTemplateLength = computed(() => {
  const config = getDataTypeConfig(templateForm.value.dataType);
  return config?.maxLength !== undefined;
});

const showTemplatePrecision = computed(() => {
  const config = getDataTypeConfig(templateForm.value.dataType);
  return config?.precision === true;
});

const showTemplateScale = computed(() => {
  return templateForm.value.dataType === 'decimal';
});

const showTemplateOptions = computed(() => {
  return ['enum', 'set'].includes(templateForm.value.dataType);
});

const currentTemplateDataType = computed(() => {
  return getDataTypeConfig(templateForm.value.dataType);
});

// 添加主键变更处理函数
const handlePrimaryKeyChange = (checked: boolean) => {
  if (!checked) {
    templateForm.value.autoIncrement = false;
  }
};

// 添加表单取消处理函数
const handleTemplateCancel = () => {
  templateFormRef.value?.resetFields();
  showTemplateForm.value = false;
};

// 添加数据类型提示计算属性
const dataTypeHint = computed(() => {
  const type = templateForm.value.dataType;
  const option = dataTypeOptions.find(opt => opt.value === type);
  if (!option) return '';

  let hint = '';
  if (option.maxLength) {
    hint += `最大长度: ${option.maxLength}`;
  }
  if (option.precision) {
    hint += hint ? ', ' : '';
    hint += '支持小数';
  }
  if (option.autoIncrement) {
    hint += hint ? ', ' : '';
    hint += '支持自增';
  }
  return hint;
});

// 修改表单中的数据类型选择部分
const templateFormContent = `
<a-form-item 
  label="数据类型" 
  name="dataType"
  :help="dataTypeHint"
>
  <a-select
    v-model:value="templateForm.dataType"
    placeholder="请选择数据类型"
    @change="handleTemplateDataTypeChange"
    :options="dataTypeOptions"
  />
</a-form-item>

<a-form-item 
  v-if="showTemplateLength" 
  label="长度" 
  name="length"
  :help="templateForm.dataType === 'decimal' ? '整数位数' : '字段长度'"
>
  <a-input-number
    v-model:value="templateForm.length"
    :min="1"
    :max="currentTemplateDataType?.maxLength"
    style="width: 100%"
    placeholder="请输入长度"
  />
  <template #extra>
    <span v-if="currentTemplateDataType?.maxLength">
      最大允许长度: {{ currentTemplateDataType.maxLength }}
    </span>
  </template>
</a-form-item>

<a-form-item 
  v-if="showTemplatePrecision" 
  label="小数位数" 
  name="precision"
  help="小数点后的位数，必须小于字段长度"
>
  <a-input-number
    v-model:value="templateForm.precision"
    :min="0"
    :max="templateForm.length ? templateForm.length - 1 : undefined"
    style="width: 100%"
    placeholder="请输入小数位数"
  />
</a-form-item>
`;

// 修改数据类型配置获取函数
const getDataTypeConfig = (type: string) => {
  return dataTypeOptions.find(option => option.value === type);
};

// 添加模板列表的响应式引用
const fieldTemplates = ref<any[]>([]);

// 添加模板列表的初始化
onMounted(async () => {
  try {
    // 从后端加载模板数据
    const response = await getTemplates();
    fieldTemplates.value = response.data.result;
  } catch (error) {
    console.error('Failed to load templates:', error);
    message.error('加载模板失败');
  }
});

// 添加模板删除处理函数
const handleDeleteTemplate = async (template: FieldTemplate) => {
  try {
    if (!template.id) {
      throw new Error('Template ID is required');
    }
    
    // 调用后端 API 删除模板
    await deleteTemplate(template.id);
    
    // 更新本地列表
    fieldTemplates.value = fieldTemplates.value.filter(t => t.id !== template.id);
    
    message.success('模板删除成功');
  } catch (error) {
    console.error('Failed to delete template:', error);
    message.error('删除模板失败');
  }
};

// 添加模板复制处理函数
const handleCopyTemplate = async (template: FieldTemplate) => {
  try {
    const newTemplate: FieldTemplate = {
      ...template,
      name: `${template.name}_复制`,
      fieldName: `${template.fieldName}_copy`
    };
    
    // 移除 id 字段，让后端生成新的 id
    delete newTemplate.id;
    delete newTemplate.createTime;
    
    // 调用后端 API 保存复制的模板
    const response = await createTemplate(newTemplate);
    
    // 更新本地列表
    fieldTemplates.value = [...fieldTemplates.value, response.data.result];
    
    message.success('模板复制成功');
  } catch (error) {
    console.error('Failed to copy template:', error);
    message.error('复制模板失败');
  }
};

// 抽取字段创建逻辑
const createSelectedField = (template: FieldTemplate) => {
  return {
    name: template.fieldName,
    displayName: template.name,
    dataType: template.dataType,
    length: template.length,
    precision: template.precision,
    nullable: template.nullable,
    primaryKey: template.primaryKey,
    autoIncrement: template.autoIncrement,
    defaultValue: template.defaultValue,
    comment: template.comment
  };
};

</script>

<style lang="less" scoped>
.field-template-selector {
  .template-selector {
    .template-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
}

.data-type-option {
  padding: 4px 0;
  
  .data-type-label {
    font-weight: 500;
  }
  
  .data-type-hint {
    margin-left: 8px;
    color: #999;
    font-size: 12px;
  }
  
  .data-type-description {
    margin-top: 2px;
    color: #666;
    font-size: 12px;
  }
}

.ant-form-item-help {
  font-size: 12px;
  color: #666;
}
</style>
