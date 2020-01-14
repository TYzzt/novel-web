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
Vue.use(require('vue-wechat-title')) /*title*/

Vue.config.productionTip = false
//axios.defaults.baseURL = 'https://novel.ineedthis.cn/novel/';
// eslint-disable-next-line no-console
// console.log(process.env)
axios.defaults.baseURL = process.env.VUE_APP_WEB_BASEPATH;
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


// 根据路由设置标题
router.afterEach((to) => {
  /*路由发生改变修改页面的title */
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'novel.ineedthis'
  }
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
