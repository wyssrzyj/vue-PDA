import App from './App'
import uView from '@/uni_modules/uview-ui'
import store from "./store/store.js"
import Vue from 'vue'
Vue.use(uView)
Vue.prototype.$store=store
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
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