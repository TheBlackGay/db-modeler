<template>
  <div class="model-design">
    <ModelSidebar />
    <div class="model-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ModelSidebar from './ModelDesign/ModelSidebar.vue'

const route = useRoute()
</script>

<style lang="scss" scoped>
.model-design {
  height: 100%;
  display: flex;
  background: #fff;

  .model-content {
    flex: 1;
    overflow: auto;
    position: relative;
  }
}
</style>
