import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8765/'

// add authorization header to axios instance
axios.interceptors.request.use(function (config) {
  config.headers.common = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
  return config;
});


createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
