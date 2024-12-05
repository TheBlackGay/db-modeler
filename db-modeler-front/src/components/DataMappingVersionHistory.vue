<template>
  <div class="data-mapping-version-history">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>版本历史</span>
          <el-button 
            type="primary" 
            size="small" 
            @click="createNewVersion"
            :icon="Plus"
          >
            创建新版本
          </el-button>
        </div>
      </template>

      <el-table 
        :data="versionHistory" 
        stripe 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column 
          prop="version" 
          label="版本号" 
          width="100"
        >
          <template #default="{ row }">
            <el-tag>v{{ row.version }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          prop="versionTag" 
          label="版本标签" 
          width="120"
        >
          <template #default="{ row }">
            <el-tag 
              :type="getVersionTagType(row.versionTag)"
            >
              {{ row.versionTag || '未标记' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          prop="description" 
          label="描述" 
          show-overflow-tooltip
        />

        <el-table-column 
          prop="user.username" 
          label="创建人" 
          width="120"
        >
          <template #default="{ row }">
            <el-avatar 
              :size="24" 
              :src="row.user.avatar"
            />
            {{ row.user.username }}
          </template>
        </el-table-column>

        <el-table-column 
          prop="createdAt" 
          label="创建时间" 
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column 
          prop="status" 
          label="状态" 
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          label="操作" 
          width="250"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small" 
                @click="viewVersionDetails(row)"
                :icon="View"
              >
                详情
              </el-button>
              <el-button 
                type="warning" 
                size="small" 
                @click="compareVersion(row)"
                :icon="Connection"
                :disabled="!canCompare"
              >
                比较
              </el-button>
              <el-button 
                type="success" 
                size="small" 
                @click="publishVersion(row)"
                :icon="Position"
                v-if="row.status !== 'published'"
              >
                发布
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="fetchVersionHistory"
        @current-change="fetchVersionHistory"
      />
    </el-card>

    <!-- 版本详情对话框 -->
    <el-dialog 
      v-model="versionDetailsVisible" 
      title="版本详情" 
      width="80%"
    >
      <version-details 
        v-if="selectedVersion" 
        :version="selectedVersion"
      />
    </el-dialog>

    <!-- 版本比较对话框 -->
    <el-dialog 
      v-model="versionCompareVisible" 
      title="版本比较" 
      width="90%"
    >
      <version-comparison 
        v-if="comparedVersions.length === 2" 
        :versions="comparedVersions"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  ElMessage, 
  ElMessageBox 
} from 'element-plus'
import { 
  Plus, 
  View, 
  Connection, 
  Position 
} from '@element-plus/icons-vue'
import dataMappingVersionApi from '@/api/dataMappingVersionApi'
import { formatDate } from '@/utils/dateUtils'
import VersionDetails from './VersionDetails.vue'
import VersionComparison from './VersionComparison.vue'

const props = defineProps({
  mappingConfigId: {
    type: String,
    required: true
  }
})

const versionHistory = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const versionDetailsVisible = ref(false)
const selectedVersion = ref(null)
const versionCompareVisible = ref(false)
const comparedVersions = ref([])

const canCompare = computed(() => {
  return versionHistory.value.length > 1
})

const fetchVersionHistory = async () => {
  loading.value = true
  try {
    const response = await dataMappingVersionApi.getVersionHistory(
      props.mappingConfigId, 
      { 
        page: currentPage.value, 
        pageSize: pageSize.value 
      }
    )
    versionHistory.value = response.data.versions
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取版本历史失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const createNewVersion = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入版本描述', '创建新版本', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '版本描述不能为空'
    })

    await dataMappingVersionApi.createVersion({
      mappingConfigId: props.mappingConfigId,
      description: value
    })

    ElMessage.success('版本创建成功')
    fetchVersionHistory()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('创建版本失败：' + error.message)
    }
  }
}

const viewVersionDetails = (version) => {
  selectedVersion.value = version
  versionDetailsVisible.value = true
}

const compareVersion = () => {
  if (versionHistory.value.length < 2) {
    ElMessage.warning('需要至少两个版本才能比较')
    return
  }

  ElMessageBox({
    title: '选择比较版本',
    message: '请选择两个要比较的版本',
    distinguishCancelAndClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: true,
    showClose: false,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        const selectedVersions = instance.selectedVersions || []
        if (selectedVersions.length !== 2) {
          ElMessage.warning('请选择两个版本')
          return
        }
        comparedVersions.value = selectedVersions
        versionCompareVisible.value = true
        done()
      } else {
        done()
      }
    },
    render: () => {
      return h('div', {}, [
        h('el-table', {
          data: versionHistory.value,
          'onSelection-change': (selection) => {
            this.selectedVersions = selection
          },
          style: { width: '100%' }
        }, [
          h('el-table-column', { type: 'selection', width: 55 }),
          h('el-table-column', { prop: 'version', label: '版本号' }),
          h('el-table-column', { prop: 'description', label: '描述' })
        ])
      ])
    }
  })
}

const publishVersion = async (version) => {
  try {
    await ElMessageBox.confirm(
      `确定要发布版本 v${version.version} 吗？`, 
      '发布版本', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await dataMappingVersionApi.publishVersion(version.id)
    ElMessage.success('版本发布成功')
    fetchVersionHistory()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('版本发布失败：' + error.message)
    }
  }
}

const getVersionTagType = (tag) => {
  const tagTypeMap = {
    'stable': 'success',
    'beta': 'warning',
    'alpha': 'info'
  }
  return tagTypeMap[tag] || 'info'
}

const getStatusType = (status) => {
  const statusTypeMap = {
    'draft': 'info',
    'published': 'success',
    'deprecated': 'warning'
  }
  return statusTypeMap[status] || 'info'
}

const getStatusLabel = (status) => {
  const statusLabelMap = {
    'draft': '草稿',
    'published': '已发布',
    'deprecated': '已废弃'
  }
  return statusLabelMap[status] || status
}

onMounted(() => {
  fetchVersionHistory()
})
</script>

<style scoped>
.data-mapping-version-history {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
