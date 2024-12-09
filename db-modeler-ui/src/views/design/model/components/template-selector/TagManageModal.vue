<template>
  <a-modal
    :visible="modelValue"
    title="标签管理"
    width="800px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="tag-manager">
      <div class="tag-input">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              v-model:value="newTag.name"
              placeholder="输入新标签"
              @pressEnter="handleAddTag"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              v-model:value="newTag.icon"
              placeholder="选择图标"
              style="width: 120px"
              :options="iconOptions"
            >
              <template #option="{ value, label }">
                <span>
                  <component :is="value" style="margin-right: 8px" />
                  {{ label }}
                </span>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select
              v-model:value="newTag.color"
              placeholder="选择颜色"
              style="width: 120px"
              :options="colorOptions"
            >
              <template #option="{ value, label }">
                <span>
                  <div
                    class="color-block"
                    :style="{ backgroundColor: value }"
                  />
                  {{ label }}
                </span>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleAddTag">
              添加标签
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="tag-list">
        <a-row :gutter="[8, 8]">
          <a-col v-for="tag in tags" :key="tag.id" :span="8">
            <a-tag
              :color="tag.color"
              closable
              @close="handleDeleteTag(tag)"
            >
              <template #icon>
                <component v-if="tag.icon" :is="tag.icon" />
              </template>
              {{ tag.name }}
              <a-badge
                v-if="tagCount[tag.id]"
                :count="tagCount[tag.id]"
                :number-style="{ backgroundColor: '#52c41a' }"
              />
            </a-tag>
          </a-col>
        </a-row>
      </div>

      <div class="tag-merge" v-if="selectedTags.length >= 2">
        <a-divider>合并标签</a-divider>
        <a-space>
          <a-select
            v-model:value="selectedTags"
            mode="multiple"
            placeholder="选择要合并的标签"
            style="width: 300px"
            :options="tags.map(tag => ({ value: tag.id, label: tag.name }))"
          />
          <a-input
            v-model:value="mergeTag.name"
            placeholder="新标签名称"
            style="width: 150px"
          />
          <a-select
            v-model:value="mergeTag.color"
            placeholder="选择颜色"
            style="width: 120px"
            :options="colorOptions"
          >
            <template #option="{ value, label }">
              <span>
                <div
                  class="color-block"
                  :style="{ backgroundColor: value }"
                />
                {{ label }}
              </span>
            </template>
          </a-select>
          <a-select
            v-model:value="mergeTag.icon"
            placeholder="选择图标"
            style="width: 120px"
            :options="iconOptions"
          >
            <template #option="{ value, label }">
              <span>
                <component :is="value" style="margin-right: 8px" />
                {{ label }}
              </span>
            </template>
          </a-select>
          <a-button type="primary" @click="handleMergeTags">
            合并
          </a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import {
  TagOutlined,
  FlagOutlined,
  StarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  BookOutlined,
  BulbOutlined,
} from '@ant-design/icons-vue';
import type { Template, Tag } from '../types';

const props = defineProps<{
  modelValue: boolean;
  templates: Template[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update-tags', templates: Template[]): void;
}>();

// 状态
const newTag = ref<Partial<Tag>>({
  name: '',
  color: '',
  icon: '',
});

const selectedTags = ref<string[]>([]);
const mergeTag = ref<Partial<Tag>>({
  name: '',
  color: '',
  icon: '',
});

// 图标选项
const iconOptions = [
  { label: '标签', value: 'TagOutlined' },
  { label: '旗帜', value: 'FlagOutlined' },
  { label: '星星', value: 'StarOutlined' },
  { label: '心形', value: 'HeartOutlined' },
  { label: '对勾', value: 'CheckCircleOutlined' },
  { label: '时钟', value: 'ClockCircleOutlined' },
  { label: '警告', value: 'ExclamationCircleOutlined' },
  { label: '信息', value: 'InfoCircleOutlined' },
  { label: '书本', value: 'BookOutlined' },
  { label: '灯泡', value: 'BulbOutlined' },
];

// 颜色选项
const colorOptions = [
  { label: '蓝色', value: '#1890ff' },
  { label: '绿色', value: '#52c41a' },
  { label: '红色', value: '#f5222d' },
  { label: '橙色', value: '#fa8c16' },
  { label: '黄色', value: '#fadb14' },
  { label: '紫色', value: '#722ed1' },
  { label: '粉色', value: '#eb2f96' },
  { label: '青色', value: '#13c2c2' },
  { label: '灰色', value: '#8c8c8c' },
  { label: '褐色', value: '#614700' },
];

// 计算所有标签
const tags = computed(() => {
  const tagMap = new Map<string, Tag>();
  props.templates.forEach(template => {
    template.tags?.forEach(tag => {
      tagMap.set(tag.id, tag);
    });
  });
  return Array.from(tagMap.values());
});

// 计算每个标签的使用次数
const tagCount = computed(() => {
  const count: Record<string, number> = {};
  props.templates.forEach(template => {
    template.tags?.forEach(tag => {
      count[tag.id] = (count[tag.id] || 0) + 1;
    });
  });
  return count;
});

// 添加标签
const handleAddTag = () => {
  if (!newTag.value.name) {
    return;
  }

  const name = newTag.value.name.trim();
  if (tags.value.some(t => t.name === name)) {
    message.warning('标签已存在');
    return;
  }

  const tag: Tag = {
    id: crypto.randomUUID(),
    name,
    color: newTag.value.color || '#1890ff',
    icon: newTag.value.icon || 'TagOutlined',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 为选中的模板添加新标签
  const updatedTemplates = props.templates.map(template => {
    if (template.selected) {
      return {
        ...template,
        tags: [...(template.tags || []), tag],
      };
    }
    return template;
  });

  emit('update-tags', updatedTemplates);
  newTag.value = { name: '', color: '', icon: '' };
  message.success('标签添加成功');
};

// 删除标签
const handleDeleteTag = (tag: Tag) => {
  const updatedTemplates = props.templates.map(template => ({
    ...template,
    tags: (template.tags || []).filter(t => t.id !== tag.id),
  }));

  emit('update-tags', updatedTemplates);
  message.success('标签删除成功');
};

// 合并标签
const handleMergeTags = () => {
  if (!mergeTag.value.name || selectedTags.value.length < 2) {
    message.warning('请选择要合并的标签并输入新标签名');
    return;
  }

  const newTag: Tag = {
    id: crypto.randomUUID(),
    name: mergeTag.value.name.trim(),
    color: mergeTag.value.color || '#1890ff',
    icon: mergeTag.value.icon || 'TagOutlined',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const updatedTemplates = props.templates.map(template => {
    const templateTags = template.tags || [];
    if (templateTags.some(tag => selectedTags.value.includes(tag.id))) {
      const remainingTags = templateTags.filter(tag => !selectedTags.value.includes(tag.id));
      return {
        ...template,
        tags: [...remainingTags, newTag],
      };
    }
    return template;
  });

  emit('update-tags', updatedTemplates);
  selectedTags.value = [];
  mergeTag.value = { name: '', color: '', icon: '' };
  message.success('标签合并成功');
};

// 关闭弹窗
const handleCancel = () => {
  emit('update:modelValue', false);
  selectedTags.value = [];
  mergeTag.value = { name: '', color: '', icon: '' };
};

const handleOk = () => {
  emit('update:modelValue', false);
  selectedTags.value = [];
  mergeTag.value = { name: '', color: '', icon: '' };
};
</script>

<style scoped>
.tag-manager {
  .tag-input {
    margin-bottom: 16px;
  }

  .tag-list {
    margin-bottom: 16px;
    
    .ant-tag {
      margin: 4px;
      padding: 4px 8px;
      
      .anticon {
        margin-right: 8px;
      }
    }
  }

  .tag-merge {
    margin-top: 16px;
  }

  .color-block {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    vertical-align: middle;
    border-radius: 2px;
  }
}
</style>
