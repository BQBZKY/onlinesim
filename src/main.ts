import {createApp} from 'vue'
import {IonicVue as ionic} from '@ionic/vue'
import router from './router'
import AppVue from './app.vue'
import './styles'

const app = createApp(AppVue)
  .use(router)
  .use(ionic)

router.isReady().then(() => {
  app.mount('#app')
})
