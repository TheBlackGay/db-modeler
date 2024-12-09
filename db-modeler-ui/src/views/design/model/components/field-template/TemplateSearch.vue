<template>
  <div class="template-search">
    <transition name="fade" mode="out-in">
      <template-skeleton v-if="showSkeleton" />
      <div v-else class="search-container">
        <div class="search-left">
          <a-dropdown 
            :trigger="['click']" 
            overlayClassName="search-history-dropdown"
            v-model:visible="showHistory"
          >
            <div 
              class="search-input-wrapper" 
              :class="{ 
                'is-error': isError,
                'is-loading': isLoading,
                'is-success': isSuccess,
                [`state-${transitionState}`]: true
              }"
            >
              <transition name="fade">
                <a-input-search
                  v-model:value="searchText"
                  placeholder="搜索模板..."
                  style="width: 300px"
                  @search="handleSearch"
                  @change="handleSearchChange"
                  allow-clear
                  :disabled="isLoading"
                >
                  <template #prefix>
                    <transition name="fade" mode="out-in">
                      <div v-if="isLoading" class="loading-wrapper">
                        <loading-outlined spin class="loading-icon" />
                        <div class="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                      <search-outlined v-else class="search-icon" />
                    </transition>
                  </template>
                  <template #suffix>
                    <transition name="fade" mode="out-in">
                      <div v-if="isError" class="status-icon error-icon">
                        <warning-outlined />
                        <div class="ripple"></div>
                      </div>
                      <div v-else-if="isSuccess" class="status-icon success-icon">
                        <check-outlined />
                        <div class="ripple"></div>
                      </div>
                    </transition>
                  </template>
                </a-input-search>
              </transition>

              <!-- 进度条 -->
              <div 
                class="progress-bar" 
                :style="{ 
                  width: `${(progressValue / progressTotal) * 100}%`,
                  opacity: isLoading ? 1 : 0
                }"
              ></div>
              
              <transition name="slide-fade">
                <div v-if="isError" class="error-message">
                  <warning-outlined />
                  <span>{{ errorMessage }}</span>
                  <div class="error-progress"></div>
                </div>
              </transition>

              <transition name="rotate">
                <a-button
                  class="advanced-search-btn"
                  type="link"
                  @click.stop="showAdvanced = true"
                  :disabled="isLoading"
                >
                  <filter-outlined />
                </a-button>
              </transition>
            </div>

            <template #overlay>
              <transition name="zoom">
                <a-card v-if="searchHistory.length > 0" class="search-history-card">
                  <template #title>
                    <div class="history-header">
                      <span>搜索历史</span>
                      <div class="header-right">
                        <span v-if="isLoading" class="loading-text">
                          <loading-outlined spin />
                          搜索中...
                        </span>
                        <a-button type="link" @click="clearHistory" class="clear-btn">
                          清空
                        </a-button>
                      </div>
                    </div>
                  </template>
                  <div 
                    class="history-container"
                    :class="{ 'is-loading': isLoading }"
                  >
                    <div v-if="isLoading" class="loading-overlay">
                      <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-dot"></div>
                      </div>
                      <span class="loading-text">加载中...</span>
                    </div>
                    <transition-group 
                      name="list" 
                      tag="div" 
                      class="history-list"
                    >
                      <a-list size="small">
                        <a-list-item 
                          v-for="item in searchHistory" 
                          :key="item"
                          :class="{ 
                            'is-selected': selectedItems.includes(item),
                            'is-disabled': isLoading 
                          }"
                        >
                          <div 
                            class="history-item" 
                            @click="handleSelect(item)"
                          >
                            <transition name="fade" mode="out-in">
                              <check-outlined 
                                v-if="selectedItems.includes(item)" 
                                class="selected-icon" 
                              />
                              <clock-circle-outlined v-else class="history-icon" />
                            </transition>
                            <span>{{ item }}</span>
                            <div v-if="isLoading" class="item-loading-indicator">
                              <div class="loading-bar"></div>
                            </div>
                          </div>
                        </a-list-item>
                      </a-list>
                    </transition-group>
                  </div>
                </a-card>
              </transition>
            </template>
          </a-dropdown>

          <transition name="bounce">
            <a-tooltip title="显示最近使用">
              <a-button
                :type="showRecent ? 'primary' : 'default'"
                shape="circle"
                class="recent-btn"
                @click="toggleRecent"
                :disabled="isLoading"
              >
                <template #icon>
                  <transition name="fade" mode="out-in">
                    <div v-if="isLoading" class="btn-loading">
                      <loading-outlined spin />
                      <div class="loading-ring"></div>
                    </div>
                    <history-outlined v-else />
                  </transition>
                </template>
              </a-button>
            </a-tooltip>
          </transition>
        </div>

        <div class="search-right">
          <a-radio-group 
            v-model:value="viewMode" 
            size="small" 
            @change="handleViewModeChange"
            button-style="solid"
          >
            <a-radio-button value="card">
              <template #icon><app-store-outlined /></template>
              卡片视图
            </a-radio-button>
            <a-radio-button value="table">
              <template #icon><table-outlined /></template>
              表格视图
            </a-radio-button>
          </a-radio-group>
        </div>

        <!-- 高级搜索抽屉 -->
        <a-drawer
          title="高级搜索"
          placement="right"
          :visible="showAdvanced"
          @close="showAdvanced = false"
          width="400"
          class="advanced-search-drawer"
        >
          <a-form layout="vertical">
            <a-form-item label="数据类型">
              <a-select
                v-model:value="advancedSearch.dataTypes"
                mode="multiple"
                placeholder="选择数据类型"
                :options="dataTypeOptions"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="标签">
              <a-select
                v-model:value="advancedSearch.tags"
                mode="multiple"
                placeholder="选择标签"
                :options="tagOptions"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="创建时间">
              <a-range-picker
                v-model:value="advancedSearch.dateRange"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
              />
            </a-form-item>
            <a-form-item label="模板类型">
              <a-checkbox-group v-model:value="advancedSearch.templateTypes">
                <a-checkbox value="system">系统模板</a-checkbox>
                <a-checkbox value="custom">自定义模板</a-checkbox>
                <a-checkbox value="imported">导入模板</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
          <template #footer>
            <a-space>
              <a-button @click="resetAdvancedSearch">重置</a-button>
              <a-button type="primary" @click="handleAdvancedSearch">应用筛选</a-button>
            </a-space>
          </template>
        </a-drawer>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  SearchOutlined,
  HistoryOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  TableOutlined,
  LoadingOutlined,
  CheckOutlined,
  WarningOutlined
} from '@ant-design/icons-vue'
import TemplateSkeleton from './TemplateSkeleton.vue'

const SEARCH_HISTORY_KEY = 'template-search-history'
const MAX_HISTORY_ITEMS = 10

const props = defineProps<{
  initialViewMode?: 'card' | 'table'
  initialShowRecent?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', value: string, advanced: any): void
  (e: 'viewModeChange', mode: 'card' | 'table'): void
  (e: 'toggleRecent', show: boolean): void
}>()

const searchText = ref('')
const viewMode = ref(props.initialViewMode || 'card')
const showRecent = ref(props.initialShowRecent || false)
const showHistory = ref(false)
const showAdvanced = ref(false)
const searchHistory = ref<string[]>(loadSearchHistory())

// 高级搜索选项
const advancedSearch = ref({
  dataTypes: [],
  tags: [],
  dateRange: null,
  templateTypes: ['system', 'custom']
})

const dataTypeOptions = [
  { label: 'VARCHAR', value: 'varchar' },
  { label: 'INTEGER', value: 'integer' },
  { label: 'DECIMAL', value: 'decimal' },
  { label: 'DATETIME', value: 'datetime' },
  { label: 'BOOLEAN', value: 'boolean' }
]

const tagOptions = [
  { label: '常用', value: 'common' },
  { label: '系统', value: 'system' },
  { label: '自定义', value: 'custom' }
]

// 加载搜索历史
function loadSearchHistory(): string[] {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

// 保存搜索历史
function saveSearchHistory() {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
  } catch {
    console.warn('Failed to save search history')
  }
}

// 添加搜索历史
function addToHistory(text: string) {
  if (!text || searchHistory.value.includes(text)) return
  
  searchHistory.value.unshift(text)
  if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
    searchHistory.value.pop()
  }
  saveSearchHistory()
}

// 清空搜索历史
function clearHistory() {
  searchHistory.value = []
  saveSearchHistory()
  showHistory.value = false
}

// 使用历史记录项
function useHistoryItem(text: string) {
  searchText.value = text
  showHistory.value = false
  handleSearch()
}

// 处理搜索状态转换
const transitionState = ref('idle') // idle, loading, success, error
const progressValue = ref(0)
const progressTotal = ref(100)

const handleSearchStateTransition = async () => {
  if (!searchText.value.trim()) return
  
  // 开始加载状态
  transitionState.value = 'loading'
  isLoading.value = true
  isError.value = false
  isSuccess.value = false
  progressValue.value = 0
  
  try {
    // 模拟进度更新
    const interval = setInterval(() => {
      if (progressValue.value < 90) {
        progressValue.value += Math.random() * 15
      }
    }, 200)

    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    clearInterval(interval)
    progressValue.value = 100
    
    // 切换到成功状态
    transitionState.value = 'success'
    isSuccess.value = true
    isLoading.value = false
    
    // 延迟重置状态
    setTimeout(() => {
      transitionState.value = 'idle'
      isSuccess.value = false
    }, 1500)
    
  } catch (error) {
    clearInterval(interval)
    // 切换到错误状态
    transitionState.value = 'error'
    isError.value = true
    errorMessage.value = error.message || '搜索失败，请重试'
    
    // 延迟重置状态
    setTimeout(() => {
      transitionState.value = 'idle'
      isError.value = false
      errorMessage.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  handleSearchStateTransition()
}

// 处理选择
const handleSelect = (item: string) => {
  const index = selectedItems.value.indexOf(item)
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

// 处理搜索框变化
function handleSearchChange() {
  if (!searchText.value) {
    emit('search', '', advancedSearch.value)
  }
}

// 处理视图模式变化
function handleViewModeChange() {
  emit('viewModeChange', viewMode.value)
}

// 切换最近使用
function toggleRecent() {
  showRecent.value = !showRecent.value
  emit('toggleRecent', showRecent.value)
}

// 重置高级搜索
function resetAdvancedSearch() {
  advancedSearch.value = {
    dataTypes: [],
    tags: [],
    dateRange: null,
    templateTypes: ['system', 'custom']
  }
}

// 处理高级搜索
function handleAdvancedSearch() {
  showAdvanced.value = false
  handleSearch()
}

// 监听搜索文本变化，显示/隐藏历史记录
watch(searchText, (newVal) => {
  showHistory.value = !newVal
})

// 新增状态变量
const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)
const selectedItems = ref<string[]>([])
const showSkeleton = ref(true)

// 初始化时加载数据
const initData = async () => {
  showSkeleton.value = true
  try {
    // 模拟数据加载延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    // TODO: 实际的数据加载逻辑
  } finally {
    showSkeleton.value = false
  }
}

// 在组件挂载时初始化数据
onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
// 主容器样式
.template-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .search-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .search-input-wrapper {
      display: flex;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-1px);
      }

      .search-icon {
        transition: all 0.3s ease;
        &:hover {
          color: #1890ff;
          transform: scale(1.1);
        }
      }

      .advanced-search-btn {
        margin-left: 4px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: rotate(90deg);
          color: #1890ff;
        }
      }

      &.is-error {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        transform: translate3d(0, 0, 0);
        
        .ant-input-affix-wrapper {
          border-color: #ff4d4f;
          box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
        }
      }

      &.is-loading {
        .ant-input-affix-wrapper {
          background: rgba(0, 0, 0, 0.02);
        }

        .loading-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;

          .loading-dots {
            display: flex;
            gap: 2px;

            span {
              width: 4px;
              height: 4px;
              background-color: #1890ff;
              border-radius: 50%;
              animation: loading-dots 1.4s infinite ease-in-out;

              &:nth-child(1) {
                animation-delay: 0s;
              }
              &:nth-child(2) {
                animation-delay: 0.2s;
              }
              &:nth-child(3) {
                animation-delay: 0.4s;
              }
            }
          }
        }
      }

      &.is-success {
        .ant-input-affix-wrapper {
          border-color: #52c41a;
          background: rgba(82, 196, 26, 0.05);
        }
      }

      .status-icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .ripple {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        &.error-icon .ripple {
          border: 1px solid #ff4d4f;
        }

        &.success-icon .ripple {
          border: 1px solid #52c41a;
        }
      }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
      overflow: hidden;

      .error-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: #ff4d4f;
        animation: error-progress 3s linear;
      }
    }
  }

  .history-container {
    position: relative;
    min-height: 100px;

    &.is-loading {
      .history-list {
        filter: blur(1px);
        opacity: 0.7;
      }
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      z-index: 1;

      .loading-spinner {
        position: relative;
        width: 40px;
        height: 40px;
        margin-bottom: 8px;

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid #1890ff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spinner-rotate 1s linear infinite;
        }

        .spinner-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background-color: #1890ff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: spinner-dot 1s ease-in-out infinite;
        }
      }

      .loading-text {
        color: #1890ff;
        font-size: 12px;
      }
    }
  }

  .history-item {
    position: relative;

    .item-loading-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      overflow: hidden;

      .loading-bar {
        height: 100%;
        background-color: #1890ff;
        animation: loading-bar 1s infinite linear;
      }
    }
  }

  .btn-loading {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid #1890ff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: btn-loading-rotate 1s linear infinite;
    }
  }
}

// 加载动画
@keyframes loading-dots {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(2);
  }
}

@keyframes error-progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner-dot {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
  }
}

@keyframes loading-bar {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// 基础动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 滑动动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

// 缩放动画
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

// 旋转动画
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-enter-from,
.rotate-leave-to {
  transform: rotate(-180deg);
  opacity: 0;
}

// 列表动画
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// 弹跳动画
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

// 脉冲动画
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

// 状态转换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from,
.state-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 进度条样式
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  transition: width 0.2s ease, opacity 0.3s ease;
}

// 状态切换动画
.state-enter-active,
.state-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.state-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.state-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

// 进度条动画
@keyframes progress-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-bar {
  background-size: 200% 100%;
  animation: progress-loading 2s linear infinite;
}

// 状态图标动画
.status-icon {
  &.success-icon {
    .ripple {
      border-color: #52c41a;
      animation: success-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }

  &.error-icon {
    .ripple {
      border-color: #ff4d4f;
      animation: error-ripple 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  }
}

@keyframes success-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(82, 196, 26, 0);
  }
}

@keyframes error-ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    border-color: rgba(255, 77, 79, 0);
  }
}

// 状态相关样式
.search-input-wrapper {
  &.state-loading {
    .ant-input-affix-wrapper {
      background: rgba(24, 144, 255, 0.02);
      border-color: #1890ff;
    }

    .loading-wrapper {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &.state-success {
    .ant-input-affix-wrapper {
      background: rgba(82, 196, 26, 0.02);
      border-color: #52c41a;
    }

    .success-icon {
      animation: success-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }

  &.state-error {
    .ant-input-affix-wrapper {
      background: rgba(255, 77, 79, 0.02);
      border-color: #ff4d4f;
    }

    .error-icon {
      animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
  }

  &.state-transition {
