&lt;template>
  &lt;g
    :transform="`translate(${x}, ${y})`"
    @mousedown="handleMouseDown"
    class="table-node"
    :class="{ active: isActive }"
  >
    &lt;!-- 表格背景 -->
    &lt;rect
      :width="width"
      :height="height"
      rx="4"
      ry="4"
      class="table-bg"
    />

    &lt;!-- 表格标题 -->
    &lt;g class="table-header">
      &lt;rect
        :width="width"
        :height="30"
        rx="4"
        ry="4"
        class="header-bg"
      />
      &lt;text
        x="12"
        y="20"
        class="header-text"
      >{{ table.name }}&lt;/text>
    &lt;/g>

    &lt;!-- 表格字段列表 -->
    &lt;g class="table-fields">
      &lt;template v-for="(field, index) in table.fields" :key="field.id">
        &lt;g
          class="field-row"
          :transform="`translate(0, ${30 + index * 24})`"
        >
          &lt;!-- 主键标识 -->
          &lt;text
            x="12"
            y="16"
            class="field-pk"
            v-if="field.primaryKey"
          >🔑&lt;/text>
          &lt;!-- 字段名称 -->
          &lt;text
            :x="field.primaryKey ? 28 : 12"
            y="16"
            class="field-name"
          >{{ field.name }}&lt;/text>
          &lt;!-- 字段类型 -->
          &lt;text
            :x="width - 12"
            y="16"
            class="field-type"
          >{{ field.type }}&lt;/text>
        &lt;/g>
      &lt;/template>
    &lt;/g>
  &lt;/g>
&lt;/template>

&lt;script setup lang="ts">
import { computed } from 'vue'
import type { Table } from '@/types/table'

const props = defineProps<{
  table: Table
  x: number
  y: number
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'move', x: number, y: number): void
}>()

// 计算表格的宽度和高度
const width = computed(() => 200)
const height = computed(() => 30 + (props.table.fields?.length || 0) * 24)

// 处理鼠标按下事件，开始拖拽
const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault()
  emit('select')

  const startX = event.clientX
  const startY = event.clientY
  const initialX = props.x
  const initialY = props.y

  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    emit('move', initialX + dx, initialY + dy)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
&lt;/script>

&lt;style lang="scss" scoped>
.table-node {
  cursor: move;

  .table-bg {
    fill: #fff;
    stroke: #d9d9d9;
    stroke-width: 1;
  }

  .header-bg {
    fill: #fafafa;
    stroke: #d9d9d9;
    stroke-width: 1;
  }

  .header-text {
    fill: #000;
    font-size: 14px;
    font-weight: 500;
  }

  .field-row {
    .field-pk {
      font-size: 12px;
    }

    .field-name {
      fill: #000;
      font-size: 12px;
    }

    .field-type {
      fill: #666;
      font-size: 12px;
      text-anchor: end;
    }
  }

  &.active {
    .table-bg {
      stroke: #1890ff;
      stroke-width: 2;
    }

    .header-bg {
      stroke: #1890ff;
      stroke-width: 2;
    }
  }
}
&lt;/style>
