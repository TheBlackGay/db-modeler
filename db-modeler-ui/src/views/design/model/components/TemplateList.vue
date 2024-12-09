<template>
  <div class="template-list">
    <a-list
      :data-source="templates"
      :grid="{ gutter: 16, column: 2 }"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card
            :class="{ 'template-card': true, 'selected': isSelected(item.id) }"
            hoverable
            @click="() => handleSelect(item)"
          >
            <template #title>
              <div class="card-title">
                <span>{{ item.name }}</span>
                <a-space>
                  <a-button
                    type="link"
                    size="small"
                    @click.stop="() => $emit('preview', item)"
                  >
                    预览
                  </a-button>
                  <a-button
                    type="link"
                    size="small"
                    @click.stop="() => $emit('edit', item)"
                  >
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定要删除这个模板吗？"
                    @confirm.stop="() => $emit('delete', item)"
                  >
                    <a-button
                      type="link"
                      size="small"
                      danger
                      @click.stop
                    >
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </div>
            </template>
            
            <div class="template-info">
              <p><strong>字段名：</strong>{{ item.template.fieldName }}</p>
              <p><strong>数据类型：</strong>{{ item.template.dataType }}</p>
              <p v-if="item.template.length">
                <strong>长度：</strong>{{ item.template.length }}
              </p>
              <p v-if="item.template.defaultValue">
                <strong>默认值：</strong>{{ item.template.defaultValue }}
              </p>
              <p v-if="item.template.comment">
                <strong>注释：</strong>{{ item.template.comment }}
              </p>
            </div>

            <div class="template-tags" v-if="item.tags && item.tags.length">
              <a-tag
                v-for="tag in item.tags"
                :key="tag.id"
                :color="tag.color"
              >
                {{ tag.name }}
              </a-tag>
            </div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Template } from './types';

const props = defineProps<{
  templates: Template[];
  selectedKeys: string[];
}>();

const emit = defineEmits<{
  (e: 'select', template: Template): void;
  (e: 'preview', template: Template): void;
  (e: 'edit', template: Template): void;
  (e: 'delete', template: Template): void;
}>();

const isSelected = (id: string) => props.selectedKeys.includes(id);

const handleSelect = (template: Template) => {
  emit('select', template);
};
</script>

<style lang="less" scoped>
.template-list {
  .template-card {
    cursor: pointer;
    transition: all 0.3s;

    &.selected {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .template-info {
      margin: 16px 0;
      
      p {
        margin: 8px 0;
      }
    }

    .template-tags {
      margin-top: 16px;
      
      .ant-tag {
        margin: 4px;
      }
    }
  }
}
</style>
