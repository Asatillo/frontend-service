import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8765/'

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
