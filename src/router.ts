import { createRouter, createWebHistory } from '@ionic/vue-router'

import BlankPage from './pages/blank.page.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: BlankPage,
    },
  ]
})
