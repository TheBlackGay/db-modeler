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
      @ok="handleTemplateSubmit"
      @cancel="handleCancel"
    >
      <a-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        layout="vertical"
      >
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="templateForm.name" placeholder="请输入模板名称" />
        </a-form-item>

        <a-form-item label="字段名" name="fieldName">
          <a-input v-model:value="templateForm.fieldName" placeholder="请输入字段名" />
        </a-form-item>

        <a-form-item label="数据类型" name="dataType">
          <a-select
            v-model:value="templateForm.dataType"
            :options="dataTypeOptions"
            placeholder="请选择数据类型"
            @change="handleTemplateDataTypeChange"
          >
            <template #optionLabel="option">
              <span>{{ option?.label || '' }}</span>
              <span v-if="option?.value && getDataTypeConfig(option.value)?.hasLength" style="color: #999">
                ({{ getDataTypeConfig(option.value)?.maxLength || '∞' }})
              </span>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item v-if="showTemplateLength" label="长度" name="length">
          <a-input-number
            v-model:value="templateForm.length"
            :min="1"
            :max="currentTemplateDataType?.maxLength"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item v-if="showTemplatePrecision" label="精度" name="precision">
          <a-input-number
            v-model:value="templateForm.precision"
            :min="1"
            :max="currentTemplateDataType?.maxLength"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item v-if="showTemplateScale" label="小数位数" name="scale">
          <a-input-number
            v-model:value="templateForm.scale"
            :min="0"
            :max="currentTemplateDataType?.maxLength"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item v-if="showTemplateOptions" label="选项" name="options">
          <a-select
            v-model:value="templateForm.options"
            mode="tags"
            placeholder="请输入选项"
            :options="[]"
          />
        </a-form-item>

        <a-form-item label="默认值" name="defaultValue">
          <a-input v-model:value="templateForm.defaultValue" placeholder="请输入默认值" />
        </a-form-item>

        <a-form-item label="备注" name="comment">
          <a-textarea v-model:value="templateForm.comment" placeholder="请输入备注" />
        </a-form-item>

        <a-form-item label="分类" name="category">
          <a-select
            v-model:value="templateForm.category"
            :options="categories"
            placeholder="请选择分类"
          />
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="templateForm.tags"
            mode="tags"
            placeholder="请输入标签"
            :options="[]"
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
const selectedCategory = ref('all');
const showTemplateForm = ref(false);
const templateForm = ref({
  name: '',
  fieldName: '',
  dataType: '',
  length: undefined,
  precision: undefined,
  scale: undefined,
  options: [],
  defaultValue: '',
  comment: '',
  category: undefined,
  tags: [],
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

const templateRules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  fieldName: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
  dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }]
};

// 计算属性
const filteredTemplates = computed(() => {
  let templates = templateStore.templates;
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    templates = templates.filter(t => t.category?.id === selectedCategory.value);
  }
  
  // 按搜索文本筛选
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    templates = templates.filter(t => 
      t.name.toLowerCase().includes(searchLower) ||
      t.template.fieldName.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower)
    );
  }
  
  return templates;
});

// 生命周期钩子
onMounted(async () => {
  try {
    await templateStore.loadTemplates();
  } catch (error) {
    message.error('加载模板失败');
  }
});

// 方法
const handleTemplateSelect = (template: Template) => {
  const index = selectedTemplates.value.indexOf(template.id);
  if (index === -1) {
    selectedTemplates.value.push(template.id);
    selectedPreviewFields.value.push(template.template);
  } else {
    selectedTemplates.value.splice(index, 1);
    selectedPreviewFields.value = selectedPreviewFields.value.filter(
      field => field.id !== template.template.id
    );
  }
};

const handlePreview = (template: Template) => {
  activeTab.value = 'preview';
  if (!selectedTemplates.value.includes(template.id)) {
    handleTemplateSelect(template);
  }
};

const handleRemoveField = (fieldId: string) => {
  const template = templateStore.templates.find(t => t.template.id === fieldId);
  if (template) {
    const index = selectedTemplates.value.indexOf(template.id);
    if (index !== -1) {
      selectedTemplates.value.splice(index, 1);
      selectedPreviewFields.value = selectedPreviewFields.value.filter(
        field => field.id !== fieldId
      );
    }
  }
};

const handleConfirm = () => {
  emit('select', selectedPreviewFields.value);
  handleCancel();
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
    dataType: '',
    length: undefined,
    precision: undefined,
    scale: undefined,
    options: [],
    defaultValue: '',
    comment: '',
    category: undefined,
    tags: [],
  };
};

const handleTemplateSubmit = async () => {
  try {
    await templateFormRef.value.validate();
    
    const newTemplate: Template = {
      id: uuidv4(),
      name: templateForm.value.name,
      description: templateForm.value.comment,
      template: {
        id: uuidv4(),
        name: templateForm.value.name,
        fieldName: templateForm.value.fieldName,
        dataType: templateForm.value.dataType,
        length: templateForm.value.length,
        precision: templateForm.value.precision,
        scale: templateForm.value.scale,
        options: templateForm.value.options,
        defaultValue: templateForm.value.defaultValue,
        comment: templateForm.value.comment
      },
      category: templateForm.value.category ? {
        id: templateForm.value.category,
        name: '' // 分类名称会在后端填充
      } : undefined,
      tags: [] // 标签会在后端根据 tagIds 填充
    };

    await templateStore.createTemplate(newTemplate);
    message.success('创建模板成功');
    showTemplateForm.value = false;
    resetForm();
  } catch (error) {
    message.error('创建模板失败');
  }
};

const handleEdit = async (template: Template) => {
  try {
    const updatedTemplate = await templateStore.updateTemplate(template);
    message.success('更新模板成功');
    // 如果模板在预览列表中，更新预览
    const previewIndex = selectedPreviewFields.value.findIndex(
      field => field.id === template.template.id
    );
    if (previewIndex !== -1) {
      selectedPreviewFields.value[previewIndex] = updatedTemplate.template;
    }
  } catch (error) {
    message.error('更新模板失败');
  }
};

const handleDelete = async (template: Template) => {
  try {
    await templateStore.deleteTemplate(template.id);
    message.success('删除模板成功');
    // 如果模板在预览列表中，移除它
    handleRemoveField(template.template.id);
  } catch (error) {
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

const handleCategoryChange = async (value: string) => {
  selectedCategory.value = value;
};

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
  // TODO: 复制模板
  message.success('模板复制成功');
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
</style>
