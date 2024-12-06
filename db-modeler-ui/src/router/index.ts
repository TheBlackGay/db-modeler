import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/project/list',
      name: 'project-list',
      component: () => import('../components/ProjectList.vue'),
    },
    {
      path: '/project/:id',
      component: () => import('../views/ProjectDesign.vue'),
      children: [
        {
          path: 'design/model',
          name: 'model',
          component: () => import('../views/design/Model.vue'),
        },
        {
          path: 'design/type-design',
          name: 'type-design',
          component: () => import('../views/design/TypeDesign.vue'),
        },
        {
          path: 'design/code-generator',
          name: 'code-generator',
          component: () => import('../views/design/CodeGenerator.vue'),
        },
        {
          path: 'design/version-control',
          name: 'version-control',
          component: () => import('../views/design/VersionControl.vue'),
        },
        {
          path: 'design/standard-check',
          name: 'standard-check',
          component: () => import('../views/design/StandardCheck.vue'),
        }
      ]
    }
  ],
})

export default router
