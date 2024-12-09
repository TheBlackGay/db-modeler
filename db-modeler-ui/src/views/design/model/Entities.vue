<template>
  <div class="model-entities">
    <div class="content-header">
      <h2>逻辑实体</h2>
      <div class="header-actions">
        <a-space>
          <a-button type="primary">
            <template #icon><plus-outlined /></template>
            新建逻辑实体
          </a-button>
          <a-button>
            <template #icon><import-outlined /></template>
            导入
          </a-button>
          <a-button>
            <template #icon><export-outlined /></template>
            导出
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="content-body">
      <a-empty description="暂无逻辑实体" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons-vue'
</script>

<style lang="scss" scoped>
.model-entities {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .content-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
  }

  .content-body {
    flex: 1;
    background-color: #fff;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
