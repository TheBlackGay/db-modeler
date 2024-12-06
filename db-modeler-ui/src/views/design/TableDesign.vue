<template>
  <div class="pdm-table-design">
    <!-- 顶部工具栏 -->
    <div class="tool-bar">
      <div class="tool-group">
        <a-button type="text" @click="handleBack">
          <template #icon><left-outlined /></template>
          返回
        </a-button>
      </div>
      <div class="tool-group">
        <a-button type="text">
          <template #icon><save-outlined /></template>
          保存
        </a-button>
        <a-button type="text">
          <template #icon><undo-outlined /></template>
          撤销
        </a-button>
        <a-button type="text">
          <template #icon><redo-outlined /></template>
          重做
        </a-button>
      </div>
      <div class="tool-group">
        <a-button type="text">
          <template #icon><zoom-in-outlined /></template>
          放大
        </a-button>
        <a-button type="text">
          <template #icon><zoom-out-outlined /></template>
          缩小
        </a-button>
        <a-button type="text">
          <template #icon><fullscreen-outlined /></template>
          适应屏幕
        </a-button>
      </div>
      <div class="tool-group">
        <a-button type="text">
          <template #icon><export-outlined /></template>
          导出
        </a-button>
        <a-button type="text">
          <template #icon><import-outlined /></template>
          导入
        </a-button>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel-header">
          <span class="title">数据表</span>
          <a-button type="primary" size="small">
            <template #icon><plus-outlined /></template>
            新建表
          </a-button>
        </div>
        <div class="panel-content">
          <a-input-search placeholder="搜索表" size="small" />
          <div class="table-list">
            <!-- 表格列表 -->
          </div>
        </div>
      </div>

      <!-- 中间画布区域 -->
      <div class="canvas-area">
        <!-- 表格图形 -->
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-header">
          <span class="title">属性</span>
        </div>
        <div class="panel-content">
          <!-- 属性编辑表单 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import {
  LeftOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const globalStore = useGlobalStore()

const handleBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.pdm-table-design {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;

  .tool-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
    background-color: #fff;
    border-bottom: 1px solid #e8e8e8;

    .tool-group {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      border-right: 1px solid #e8e8e8;

      &:last-child {
        border-right: none;
      }
    }
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .menu-sidebar {
      width: 64px;
      background-color: #001529;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;

      .menu-item {
        width: 100%;
        height: 56px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.65);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #fff;
          background-color: #1890ff;
        }

        &.active {
          color: #fff;
          background-color: #1890ff;
        }

        span {
          margin-top: 4px;
          font-size: 12px;
        }
      }
    }

    .left-panel {
      width: 280px;
      background-color: #fff;
      border-right: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #e8e8e8;

        .title {
          font-weight: 500;
        }
      }

      .panel-content {
        flex: 1;
        padding: 12px;
        overflow-y: auto;

        .tree-node {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }

    .canvas-area {
      flex: 1;
      background-color: #fff;
      overflow: auto;
      position: relative;
    }

    .right-panel {
      width: 280px;
      background-color: #fff;
      border-left: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #e8e8e8;

        .title {
          font-weight: 500;
        }
      }

      .panel-content {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
      }
    }
  }
}
</style>
