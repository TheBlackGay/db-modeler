import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import permission from './directives/permission'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './styles/index.css'
import './styles/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

// 注册 Pinia 持久化插件
pinia.use(piniaPluginPersistedstate)

// 注册全局指令
app.directive('permission', permission)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .mount('#app')

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('组件:', vm)
  console.error('错误信息:', info)
}
