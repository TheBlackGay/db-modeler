<template>
  <div class="canvas-area" ref="canvasRef">
    <svg
      :width="width"
      :height="height"
      @mousedown="handleMouseDown"
      @wheel="handleWheel"
    >
      <!-- 缩放和平移组 -->
      <g :transform="`translate(${viewportX}, ${viewportY}) scale(${scale})`">
        <!-- 网格背景 -->
        <pattern
          id="grid"
          :width="20"
          :height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#f0f0f0"
            stroke-width="0.5"
          />
        </pattern>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
        />

        <!-- 表格节点 -->
        <template v-for="table in tables" :key="table.id">
          <table-node
            :table="table"
            :x="positions[table.id]?.x || 0"
            :y="positions[table.id]?.y || 0"
            :is-active="activeTableId === table.id"
            @select="$emit('select', table)"
            @move="(x, y) => $emit('move', table.id, x, y)"
          />
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { TableInfo } from '@/views/design/model/types'
import TableNode from './TableNode.vue'

const props = defineProps<{
  tables: TableInfo[]
  positions: Record<string, { x: number; y: number }>
  activeTableId?: string
  scale: number
  viewportX: number
  viewportY: number
}>()

const emit = defineEmits<{
  (e: 'select', table: TableInfo): void
  (e: 'move', tableId: string, x: number, y: number): void
  (e: 'update:scale', value: number): void
  (e: 'update:viewportX', value: number): void
  (e: 'update:viewportY', value: number): void
}>()

const canvasRef = ref<HTMLDivElement>()
const width = ref(1000)
const height = ref(800)

const handleWheel = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    // 缩放
    event.preventDefault()
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    const newScale = props.scale * delta
    if (newScale >= 0.1 && newScale <= 3) {
      emit('update:scale', newScale)
    }
  } else {
    // 平移
    emit('update:viewportX', props.viewportX - event.deltaX)
    emit('update:viewportY', props.viewportY - event.deltaY)
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    const startX = event.clientX
    const startY = event.clientY
    const initialX = props.viewportX
    const initialY = props.viewportY

    const handleMouseMove = (e: MouseEvent) => {
      emit('update:viewportX', initialX + (e.clientX - startX))
      emit('update:viewportY', initialY + (e.clientY - startY))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

const updateSize = () => {
  if (canvasRef.value) {
    width.value = canvasRef.value.clientWidth
    height.value = canvasRef.value.clientHeight
  }
}

onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<style lang="scss" scoped>
.canvas-area {
  flex: 1;
  background-color: #fafafa;
  overflow: auto;
  position: relative;
}
</style> 