<template>
  <div class="model-home">
    <div class="content-header">
      <h2>首页封面</h2>
    </div>
    <div class="content-body">
      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <a-card title="快捷操作">
            <a-space>
              <a-button type="primary" @click="openLink('打开首页封面')">
                打开首页封面
              </a-button>
              <a-button @click="openLink('Ctrl/Command + S 保存项目')">
                Ctrl/Command + S 保存项目
              </a-button>
              <a-button @click="openLink('Ctrl/Command + Shift + U 大小写转换')">
                Ctrl/Command + Shift + U 大小写转换
              </a-button>
            </a-space>
          </a-card>
        </a-col>
        <a-col :span="24">
          <a-card title="关系图操作">
            <a-space direction="vertical">
              <div>关系图界面，按住Ctrl/Command + M，可开关小地图</div>
              <div>关系图界面，按住Ctrl/Command + 拖动鼠标，可拖动画布</div>
              <div>关系图界面，按住Ctrl/Command + F，可开关搜索功能</div>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
const openLink = (text: string) => {
  console.log('Open link:', text)
}
</script>

<style lang="scss" scoped>
.model-home {
  padding: 24px;
  height: 100%;
  overflow-y: auto;

  .content-header {
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }
  }

  .content-body {
    .ant-card {
      background-color: #fff;
    }
  }
}
</style>
