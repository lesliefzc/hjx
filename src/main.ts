import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import service from '@/utils/https'
import serviceJson from '@/utils/httpsJson'
import {Toast} from 'vant'
import 'amfe-flexible'
import * as _ from 'lodash'
Vue.config.productionTip = false
Vue.prototype.$https = service
Vue.prototype.$httpsJson = serviceJson
Vue.prototype.$toast = Toast
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
