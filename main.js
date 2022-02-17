import App from './App'
import uView from '@/uni_modules/uview-ui'
// import uview from "uview-ui"

import Vue from 'vue'
Vue.use(uView)
// Vue.use(uview)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()


// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif