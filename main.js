import Vue from 'vue'
import App from './App'
import api from './common/api'
import store from './store'
Vue.config.productionTip = false
//注册全局
Vue.prototype.$api = api
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
