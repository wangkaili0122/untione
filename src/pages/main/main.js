/**
 * iframe嵌入的子页面的入口
 */
import '@babel/polyfill'
import Vue from 'vue'
import App from './main.vue'
import store from '@/store/store'
import axios from 'request/index'
import projectConfig from 'plugins/projectConfig.js'
import permission from 'plugins/permission/index.js'
import router from '@/router/mainRoutes.js'
import loginPlugin from 'plugins/login'
import syncTabVuexStatusPlugin from 'plugins/sync-tab-vuex-status'
import syncLoginStatusPlugin from 'plugins/sync-login-status'

import 'assets/reset.css'
import 'assets/skins/index.styl'
import '../../assets/iconfont/iconfont.css'

// 引入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import 'plugins/sso-interceptor'
import 'plugins/element.js'
import 'filter/index.js'
import 'directive/index.js'

import {visit} from  'plugins/visit.js'
import {GetDicAll} from 'request/services/dict'
import {GetSysSetting} from 'request/services/sys-setting'


Vue.config.productionTip = false

Vue.use(projectConfig)
Vue.use(loginPlugin)
Vue.use(axios)
Vue.use(permission)
syncTabVuexStatusPlugin(store)
syncLoginStatusPlugin(store)

//通过vue的errorHandler捕获异常
Vue.config.errorHandler = (err, vm, info) => {
  console.error('vue errorHandler捕获异常');
  console.error(err, vm, info)
}


async function init() {
  try {
    // 加载系统设置
    const setting = await GetSysSetting()
    projectConfig.updateSetting(setting.data.data)

    //先加载字典数据，然后再初始化系统
    const resp = await GetDicAll()
    var dicts = resp.data.data
    store.commit('dict/SET_DICTS', dicts)

  } catch (e) {
    Vue.prototype.$alert('系统初始化数据获取失败，请检查网络链接！', '错误', {type: 'error'})
    console.error(e)
  }

  new Vue({
    store,
    router,
    render: h => h(App),
    created() {

    },
    mounted() {

    }
  }).$mount('#app')
}

init()
