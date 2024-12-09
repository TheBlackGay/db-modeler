<template>
  <a-modal
    :visible="modelValue"
    title="分类管理"
    width="800px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="category-manager">
      <a-row :gutter="16">
        <!-- 左侧分类树 -->
        <a-col :span="8">
          <div class="category-tree">
            <div class="tree-header">
              <a-button type="primary" size="small" @click="handleAddRootCategory">
                添加根分类
              </a-button>
            </div>
            <a-tree
              v-model:selectedKeys="selectedKeys"
              v-model:expandedKeys="expandedKeys"
              :tree-data="categoryTreeData"
              :replaceFields="{ title: 'name', key: 'id' }"
              @select="handleSelect"
            >
              <template #title="{ name, icon }">
                <span>
                  <component v-if="icon" :is="icon" style="margin-right: 8px" />
                  {{ name }}
                </span>
              </template>
            </a-tree>
          </div>
        </a-col>

        <!-- 右侧编辑表单 -->
        <a-col :span="16">
          <div v-if="selectedCategory" class="category-form">
            <a-form
              ref="formRef"
              :model="formState"
              :rules="rules"
              layout="vertical"
            >
              <a-form-item label="分类名称" name="name">
                <a-input v-model:value="formState.name" />
              </a-form-item>

              <a-form-item label="图标" name="icon">
                <a-select
                  v-model:value="formState.icon"
                  :options="iconOptions"
                  show-search
                >
                  <template #option="{ value, label }">
                    <span>
                      <component :is="value" style="margin-right: 8px" />
                      {{ label }}
                    </span>
                  </template>
                </a-select>
              </a-form-item>

              <a-form-item label="描述" name="description">
                <a-textarea v-model:value="formState.description" />
              </a-form-item>

              <a-form-item label="排序" name="order">
                <a-input-number v-model:value="formState.order" :min="0" style="width: 100%" />
              </a-form-item>

              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="handleSave">保存</a-button>
                  <a-button @click="handleAddSubCategory">添加子分类</a-button>
                  <a-popconfirm
                    v-if="!selectedCategory.isSystem"
                    title="确定要删除这个分类吗？"
                    @confirm="handleDelete"
                  >
                    <a-button danger>删除</a-button>
                  </a-popconfirm>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
          <div v-else class="category-empty">
            <a-empty description="请选择一个分类" />
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import type { Category } from '../types';
import {
  FolderOutlined,
  DatabaseOutlined,
  TableOutlined,
  FieldTimeOutlined,
  UserOutlined,
  SettingOutlined,
  ApiOutlined,
  CodeOutlined,
  KeyOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';

// Props & Emits
const props = defineProps<{
  modelValue: boolean;
  categories: Category[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update', categories: Category[]): void;
}>();

// 状态
const selectedKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([]);
const selectedCategory = ref<Category | null>(null);
const formRef = ref();
const formState = ref({
  name: '',
  icon: '',
  description: '',
  order: 0,
});

// 图标选项
const iconOptions = [
  { label: '文件夹', value: 'FolderOutlined' },
  { label: '数据库', value: 'DatabaseOutlined' },
  { label: '表格', value: 'TableOutlined' },
  { label: '时间', value: 'FieldTimeOutlined' },
  { label: '用户', value: 'UserOutlined' },
  { label: '设置', value: 'SettingOutlined' },
  { label: 'API', value: 'ApiOutlined' },
  { label: '代码', value: 'CodeOutlined' },
  { label: '密钥', value: 'KeyOutlined' },
  { label: '链接', value: 'LinkOutlined' },
];

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入分类名称' }],
};

// 构建分类树数据
const categoryTreeData = computed(() => {
  const buildTree = (parentId?: string): any[] => {
    return props.categories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(cat => ({
        ...cat,
        children: buildTree(cat.id),
      }));
  };
  return buildTree();
});

// 处理分类选择
const handleSelect = (selectedKeys: string[]) => {
  if (selectedKeys.length > 0) {
    const category = props.categories.find(cat => cat.id === selectedKeys[0]);
    if (category) {
      selectedCategory.value = category;
      formState.value = {
        name: category.name,
        icon: category.icon || '',
        description: category.description || '',
        order: category.order || 0,
      };
    }
  } else {
    selectedCategory.value = null;
  }
};

// 添加根分类
const handleAddRootCategory = () => {
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name: '新分类',
    icon: 'FolderOutlined',
    order: props.categories.length,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  emit('update', [...props.categories, newCategory]);
  selectedKeys.value = [newCategory.id];
  handleSelect(selectedKeys.value);
};

// 添加子分类
const handleAddSubCategory = () => {
  if (!selectedCategory.value) return;
  
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name: '新子分类',
    icon: 'FolderOutlined',
    parentId: selectedCategory.value.id,
    order: props.categories.filter(cat => cat.parentId === selectedCategory.value?.id).length,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  emit('update', [...props.categories, newCategory]);
  expandedKeys.value = [...expandedKeys.value, selectedCategory.value.id];
  selectedKeys.value = [newCategory.id];
  handleSelect(selectedKeys.value);
};

// 保存分类
const handleSave = () => {
  formRef.value.validate().then(() => {
    if (!selectedCategory.value) return;
    
    const updatedCategories = props.categories.map(cat => {
      if (cat.id === selectedCategory.value?.id) {
        return {
          ...cat,
          name: formState.value.name,
          icon: formState.value.icon,
          description: formState.value.description,
          order: formState.value.order,
          updatedAt: Date.now(),
        };
      }
      return cat;
    });
    
    emit('update', updatedCategories);
    message.success('保存成功');
  });
};

// 删除分类
const handleDelete = () => {
  if (!selectedCategory.value || selectedCategory.value.isSystem) return;
  
  // 检查是否有子分类
  const hasChildren = props.categories.some(cat => cat.parentId === selectedCategory.value?.id);
  if (hasChildren) {
    message.error('请先删除子分类');
    return;
  }
  
  const updatedCategories = props.categories.filter(cat => cat.id !== selectedCategory.value?.id);
  emit('update', updatedCategories);
  selectedCategory.value = null;
  selectedKeys.value = [];
  message.success('删除成功');
};

// 关闭弹窗
const handleCancel = () => {
  emit('update:modelValue', false);
  selectedCategory.value = null;
  selectedKeys.value = [];
};

const handleOk = () => {
  emit('update:modelValue', false);
  selectedCategory.value = null;
  selectedKeys.value = [];
};
</script>

<style scoped>
.category-manager {
  height: 500px;
  
  .category-tree {
    border-right: 1px solid #f0f0f0;
    height: 100%;
    
    .tree-header {
      padding: 0 0 16px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 16px;
    }
  }
  
  .category-form {
    padding: 0 16px;
  }
  
  .category-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
