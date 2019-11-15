import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import router from './router'
import axios from 'axios'
import QS from 'qs'

Vue.use(MintUI)
Vue.use(router)

Vue.$router = router;

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:8080/novel/';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.withCredentials=true
Vue.prototype.$ajax = axios

Vue.config.productionTip = false

axios.interceptors.request.use(config => {
  if(config.method==='post'){
    config.data=QS.stringify(config.data);//防止post请求参数无法传到后台
  }
  return config
}, error => {
  return Promise.reject(error)
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
