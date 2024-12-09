<template>
  <div class="stats-panel">
    <div class="stats-header">
      <h3>模板组统计</h3>
      <a-button type="primary" @click="loadStats">
        <template #icon><reload-outlined /></template>
        刷新
      </a-button>
    </div>
    
    <div class="stats-content">
      <div class="stats-row">
        <a-card>
          <a-statistic
            title="总分组数"
            :value="stats.totalGroups"
            :valueStyle="{ color: '#3f8600' }"
          >
            <template #prefix>
              <folder-outlined />
            </template>
          </a-statistic>
        </a-card>
        
        <a-card>
          <a-statistic
            title="自定义分组"
            :value="stats.customGroups"
            :valueStyle="{ color: '#cf1322' }"
          >
            <template #prefix>
              <folder-add-outlined />
            </template>
          </a-statistic>
        </a-card>
        
        <a-card>
          <a-statistic
            title="系统分组"
            :value="stats.systemGroups"
            :valueStyle="{ color: '#1890ff' }"
          >
            <template #prefix>
              <database-outlined />
            </template>
          </a-statistic>
        </a-card>
      </div>
      
      <div class="stats-charts">
        <div class="chart-container">
          <h4>分组类型分布</h4>
          <v-chart class="chart" :option="groupTypeChartOption" autoresize />
        </div>
        
        <div class="chart-container">
          <h4>模板数量分布</h4>
          <v-chart class="chart" :option="templateDistChartOption" autoresize />
        </div>
      </div>
      
      <div class="stats-details">
        <a-collapse>
          <a-collapse-panel key="1" header="最常用模板">
            <a-list
              :dataSource="stats.mostUsedTemplates"
              size="small"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    :title="item.name"
                    :description="`使用次数: ${item.count}`"
                  />
                </a-list-item>
              </template>
            </a-list>
          </a-collapse-panel>
          
          <a-collapse-panel key="2" header="最近使用的分组">
            <a-list
              :dataSource="stats.recentlyUsedGroups"
              size="small"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    :title="item.name"
                    :description="formatDate(item.lastUsed)"
                  />
                </a-list-item>
              </template>
            </a-list>
          </a-collapse-panel>
          
          <a-collapse-panel key="3" header="热门标签">
            <div class="tag-cloud">
              <a-tag
                v-for="tag in stats.popularTags"
                :key="tag.tag"
                :color="getTagColor(tag.count)"
              >
                {{ tag.tag }} ({{ tag.count }})
              </a-tag>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  ReloadOutlined,
  FolderOutlined,
  FolderAddOutlined,
  DatabaseOutlined
} from '@ant-design/icons-vue'
import type { GroupStats } from '@/config/fieldTemplates'
import { getGroupStats } from '@/config/fieldTemplates'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const stats = ref<GroupStats>({
  totalGroups: 0,
  customGroups: 0,
  systemGroups: 0,
  totalTemplates: 0,
  averageTemplatesPerGroup: 0,
  mostUsedTemplates: [],
  recentlyUsedGroups: [],
  popularTags: [],
  templateDistribution: []
})

const groupTypeChartOption = computed(() => ({
  title: {
    text: '分组类型分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        { value: stats.value.customGroups, name: '自定义分组' },
        { value: stats.value.systemGroups, name: '系统分组' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

const templateDistChartOption = computed(() => ({
  title: {
    text: '模板数量分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: stats.value.templateDistribution.map(item => item.group),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: stats.value.templateDistribution.map(item => item.count)
    }
  ]
}))

const getTagColor = (count: number) => {
  const max = Math.max(...stats.value.popularTags.map(t => t.count))
  const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9', '#722ed1']
  const index = Math.floor((count / max) * (colors.length - 1))
  return colors[index]
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const loadStats = async () => {
  const newStats = await getGroupStats()
  stats.value = newStats
}

// 初始化时加载统计信息
loadStats()
</script>

<style scoped>
.stats-panel {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stats-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-container {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.chart {
  height: 300px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stats-details {
  :deep(.ant-collapse) {
    border: none;
    background: transparent;
  }
  
  :deep(.ant-collapse-item) {
    border-radius: 8px;
    margin-bottom: 8px;
    overflow: hidden;
  }
}
</style>
