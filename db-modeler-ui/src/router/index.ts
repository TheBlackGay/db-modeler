import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/project/list',
      name: 'project-list',
      component: () => import('../components/ProjectList.vue')
    },
    {
      path: '/project/:id',
      component: () => import('../views/ProjectDesign.vue'),
      children: [
        {
          path: 'design/model',
          name: 'model',
          component: () => import('../views/design/ModelDesign.vue'),
          redirect: { name: 'model-home' },
          children: [
            {
              path: 'home',
              name: 'model-home',
              component: () => import('../views/design/model/Home.vue')
            },
            {
              path: 'tables',
              name: 'model-tables',
              component: () => import('../views/design/model/Tables.vue')
            },
            {
              path: 'tables/:tableId/design',
              name: 'table-design',
              component: () => import('../views/design/model/TableDesign.vue')
            },
            {
              path: 'entities',
              name: 'model-entities',
              component: () => import('../views/design/model/Entities.vue')
            },
            {
              path: 'views',
              name: 'model-views',
              component: () => import('../views/design/model/Views.vue')
            },
            {
              path: 'relations',
              name: 'model-relations',
              component: () => import('../views/design/model/Relations.vue')
            },
            {
              path: 'dictionary',
              name: 'model-dictionary',
              component: () => import('../views/design/model/Dictionary.vue')
            }
          ]
        },
        {
          path: 'design/type-design',
          name: 'type-design',
          component: () => import('../views/design/TypeDesign.vue')
        },
        {
          path: 'design/code-generator',
          name: 'code-generator',
          component: () => import('../views/design/CodeGenerator.vue')
        },
        {
          path: 'design/version-control',
          name: 'version-control',
          component: () => import('../views/design/VersionControl.vue')
        },
        {
          path: 'design/standard-check',
          name: 'standard-check',
          component: () => import('../views/design/StandardCheck.vue')
        },
        {
          path: 'settings',
          name: 'project-settings',
          component: () => import('../views/ProjectSettings.vue')
        }
      ]
    }
  ],
})

export default router
