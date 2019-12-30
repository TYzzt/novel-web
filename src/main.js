import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import QS from 'qs'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import { Toast } from 'vant';

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.use(Mint);
Vue.use(router)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://122.51.85.71:8080/novel/';
// axios.defaults.baseURL = 'http://127.0.0.1:8080/novel/';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.withCredentials=true
Vue.prototype.$ajax = axios;
Vue.prototype.$Toast=Toast;

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
