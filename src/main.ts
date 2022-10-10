import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue as ionic } from '@ionic/vue'
import router from './router'
import AppVue from './app.vue'
import './styles'

const pinia = createPinia()

const app = createApp(AppVue)
  .use(router)
  .use(pinia)
  .use(ionic, {
    mode: 'ios'
  })

router.isReady().then(() => {
  app.mount('#app')
})
