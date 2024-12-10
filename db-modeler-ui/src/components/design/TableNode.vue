<template>
  <g
    :transform="`translate(${x}, ${y})`"
    @mousedown.stop="handleMouseDown"
    :class="{ active: isActive }"
    class="table-node"
  >
    <rect
      width="200"
      height="40"
      rx="4"
      ry="4"
      fill="#fff"
      stroke="#d9d9d9"
      stroke-width="1"
    />
    <text
      x="10"
      y="25"
      fill="#000"
      font-size="14"
    >{{ table.displayName }}</text>
  </g>
</template>

<script setup lang="ts">
import type { TableInfo } from '@/views/design/model/types'

const props = defineProps<{
  table: TableInfo
  x: number
  y: number
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'move', x: number, y: number): void
}>()

const handleMouseDown = (event: MouseEvent) => {
  event.stopPropagation()
  emit('select')

  const startX = event.clientX
  const startY = event.clientY
  const initialX = props.x
  const initialY = props.y

  const handleMouseMove = (e: MouseEvent) => {
    emit('move', 
      initialX + (e.clientX - startX),
      initialY + (e.clientY - startY)
    )
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="scss" scoped>
.table-node {
  cursor: move;

  &.active rect {
    stroke: #1890ff;
    stroke-width: 2;
  }

  &:hover rect {
    stroke: #40a9ff;
  }
}
</style> 