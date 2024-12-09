<template>
  <a-modal
    :visible="visible"
    :title="group ? '编辑分组' : '新建分组'"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="分组名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入分组名称" />
      </a-form-item>

      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          placeholder="请输入分组描述"
          :rows="3"
        />
      </a-form-item>

      <a-form-item label="选择模板" name="templates">
        <a-select
          v-model:value="formState.templates"
          mode="multiple"
          placeholder="请选择模板"
          :options="templateOptions"
        />
      </a-form-item>

      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="formState.tags"
          mode="tags"
          placeholder="请输入标签"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { Template, TemplateGroup } from '../types';

const props = defineProps<{
  visible: boolean;
  group?: TemplateGroup | null;
  templates: Template[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', group: TemplateGroup): void;
}>();

const formRef = ref<FormInstance>();
const formState = ref({
  name: '',
  description: '',
  templates: [] as string[],
  tags: [] as string[],
});

const rules = {
  name: [{ required: true, message: '请输入分组名称' }],
  templates: [{ required: true, message: '请选择至少一个模板' }],
};

const templateOptions = computed(() => 
  props.templates.map(t => ({
    label: t.name,
    value: t.id,
    description: t.description,
  }))
);

watch(
  () => props.group,
  (group) => {
    if (group) {
      formState.value = {
        name: group.name,
        description: group.description || '',
        templates: group.templates,
        tags: group.tags || [],
      };
    } else {
      formState.value = {
        name: '',
        description: '',
        templates: [],
        tags: [],
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit('submit', {
      id: props.group?.id || Date.now().toString(),
      ...formState.value,
      isCustom: true,
      createdAt: props.group?.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  } catch (error) {
    // 表单验证失败
  }
};

const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<style scoped>
.ant-form {
  padding: 24px 0;
}
</style>
