import '@babel/polyfill'
import Vue from 'vue'
import App from './index.vue'
import router from '@/router/indexRoutes.js'
import store from '@/store/store'
import axios from 'request/index'
import 'assets/reset.css'

import 'plugins/element.js'
import projectConfig from 'plugins/projectConfig.js'
import syncTabVuexStatusPlugin from 'plugins/sync-tab-vuex-status'
import syncLoginStatusPlugin from 'plugins/sync-login-status'
import { GetDicAll } from 'request/services/dict'
import loginPlugin from 'plugins/login'
import {visit} from  'plugins/visit.js'

import 'filter/index.js'
import 'directive/index.js'

import 'assets/skins/index.styl'

import '../../assets/iconfont/iconfont.css'
// 引入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// vue-awesome-swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import {GetSysSetting} from "@/request/services/sys-setting";
import permission from "@/plugins/permission";
Vue.use(VueAwesomeSwiper /* { default global options } */)

Vue.config.productionTip = false

Vue.use(projectConfig)
Vue.use(axios)
Vue.use(loginPlugin)
Vue.use(permission)

syncTabVuexStatusPlugin(store)
syncLoginStatusPlugin(store)

async function init() {
  try{
    // 加载系统设置
    const setting = await GetSysSetting()
    projectConfig.updateSetting(setting.data.data)


    //先加载字典数据，然后再初始化系统
    const resp = await GetDicAll()
    var dicts = resp.data.data
    store.commit('dict/SET_DICTS', dicts)
  }catch(e) {
    console.error(e)
  }

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

}
init()
