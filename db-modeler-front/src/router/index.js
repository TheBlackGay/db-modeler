import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 布局组件
import Layout from '@/layout/index.vue'

// 公共路由
const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { 
      title: '登录', 
      hidden: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register.vue'),
    meta: { 
      title: '注册', 
      hidden: true 
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/pages/403.vue'),
    meta: { 
      title: '无权限', 
      hidden: true 
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/pages/404.vue'),
    meta: { 
      title: '页面不存在', 
      hidden: true 
    }
  }
]

// 需要认证的路由
const authRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { 
          title: '仪表盘', 
          icon: 'Dashboard' 
        }
      }
    ]
  },
  {
    path: '/databases',
    component: Layout,
    redirect: '/databases/list',
    meta: { 
      title: '数据库管理', 
      icon: 'Database' 
    },
    children: [
      {
        path: 'list',
        name: 'DatabaseList',
        component: () => import('@/pages/DatabaseList.vue'),
        meta: { 
          title: '数据库列表', 
          icon: 'List' 
        }
      },
      {
        path: 'create',
        name: 'DatabaseCreate',
        component: () => import('@/pages/DatabaseEdit.vue'),
        meta: { 
          title: '创建数据库', 
          icon: 'Plus' 
        }
      },
      {
        path: 'edit/:id',
        name: 'DatabaseEdit',
        component: () => import('@/pages/DatabaseEdit.vue'),
        meta: { 
          title: '编辑数据库', 
          hidden: true 
        }
      }
    ]
  },
  {
    path: '/table-schemas',
    component: Layout,
    redirect: '/table-schemas/list',
    meta: { 
      title: '表结构管理', 
      icon: 'Grid' 
    },
    children: [
      {
        path: 'list',
        name: 'TableSchemaList',
        component: () => import('@/pages/TableSchemaList.vue'),
        meta: { 
          title: '表结构列表', 
          icon: 'List' 
        }
      },
      {
        path: 'create',
        name: 'TableSchemaCreate',
        component: () => import('@/pages/TableSchemaEdit.vue'),
        meta: { 
          title: '创建表结构', 
          icon: 'Plus' 
        }
      },
      {
        path: 'edit/:id',
        name: 'TableSchemaEdit',
        component: () => import('@/pages/TableSchemaEdit.vue'),
        meta: { 
          title: '编辑表结构', 
          hidden: true 
        }
      },
      {
        path: 'detail/:id',
        name: 'TableSchemaDetail',
        component: () => import('@/pages/TableSchemaDetail.vue'),
        meta: { 
          title: '表结构详情', 
          hidden: true 
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/profile',
    meta: { 
      title: '用户中心', 
      icon: 'User' 
    },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/pages/UserProfile.vue'),
        meta: { 
          title: '个人信息', 
          icon: 'UserFilled' 
        }
      },
      {
        path: 'settings',
        name: 'UserSettings',
        component: () => import('@/pages/UserSettings.vue'),
        meta: { 
          title: '账号设置', 
          icon: 'Setting' 
        }
      }
    ]
  }
]

const databaseRoutes = [
  {
    path: '/databases',
    name: 'DatabaseList',
    component: () => import('@/pages/DatabaseList.vue'),
    meta: {
      title: '数据库连接',
      icon: 'DataBase',
      permissions: ['database:list']
    }
  },
  {
    path: '/databases/create',
    name: 'DatabaseCreate',
    component: () => import('@/pages/DatabaseEdit.vue'),
    meta: {
      title: '创建数据库连接',
      icon: 'Plus',
      permissions: ['database:create']
    }
  },
  {
    path: '/databases/edit/:id',
    name: 'DatabaseEdit',
    component: () => import('@/pages/DatabaseEdit.vue'),
    meta: {
      title: '编辑数据库连接',
      icon: 'Edit',
      permissions: ['database:edit']
    }
  },
  {
    path: '/databases/detail/:id',
    name: 'DatabaseDetail',
    component: () => import('@/pages/DatabaseDetail.vue'),
    meta: {
      title: '数据库详情',
      icon: 'View',
      permissions: ['database:view']
    }
  }
]

const tableCompareRoutes = [
  {
    path: '/table-compare',
    name: 'TableCompare',
    component: () => import('@/pages/TableCompare.vue'),
    meta: {
      title: '表结构比较',
      icon: 'Comparison',
      permissions: ['database:compare']
    }
  }
]

const dataMappingRoutes = [
  {
    path: '/data-mapping',
    component: Layout,
    redirect: '/data-mapping/rules',
    meta: { 
      title: '数据映射', 
      icon: 'Connection' 
    },
    children: [
      {
        path: 'rules',
        name: 'DataMappingRuleList',
        component: () => import('@/pages/DataMappingRuleList.vue'),
        meta: { 
          title: '映射规则列表', 
          icon: 'List',
          permissions: ['data-mapping:list']
        }
      },
      {
        path: 'rules/create',
        name: 'DataMappingRuleCreate',
        component: () => import('@/views/DataMappingRulePreview.vue'),
        meta: { 
          title: '创建映射规则', 
          icon: 'Plus',
          permissions: ['data-mapping:create']
        }
      },
      {
        path: 'rules/edit/:id',
        name: 'DataMappingRuleEdit',
        component: () => import('@/views/DataMappingRulePreview.vue'),
        meta: { 
          title: '编辑映射规则', 
          hidden: true,
          permissions: ['data-mapping:edit']
        }
      },
      {
        path: 'rules/detail/:id',
        name: 'DataMappingRuleDetail',
        component: () => import('@/pages/DataMappingRuleDetail.vue'),
        meta: { 
          title: '映射规则详情', 
          hidden: true,
          permissions: ['data-mapping:view']
        }
      }
    ]
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...authRoutes, ...databaseRoutes, ...tableCompareRoutes, ...dataMappingRoutes, 
    { 
      path: '/:pathMatch(.*)*', 
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()

  const userStore = useUserStore()
  const token = userStore.token

  // 公共路由直接放行
  if (publicRoutes.some(route => route.path === to.path)) {
    next()
    return
  }

  // 检查登录状态
  if (!token) {
    next('/login')
    return
  }

  // TODO: 权限检查
  // if (!hasPermission(to)) {
  //   next('/403')
  //   return
  // }

  next()
})

router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router
