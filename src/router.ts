import { createRouter, createWebHistory } from '@ionic/vue-router'

import FreePhoneNumbersPage from '@/pages/free/phone-numbers'
import FreeMessagesPage from '@/pages/free/messages'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/free/phone-numbers',
    },
    {
      path: '/free/phone-numbers',
      component: FreePhoneNumbersPage,
    },
    {
      path: '/free/messages/:phoneNumber',
      component: FreeMessagesPage,
    },
  ]
})
