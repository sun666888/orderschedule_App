import Vue from 'vue'
import App from './App.vue' // 入口文件
import router from './router' // 路由管理的文件
import store from './store' // 全局管理的vuex数据状态
import './icons' // svg中需要使用的svg图标内容
import 'lib-flexible' // 移动端适配
import 'normalize.css' // A modern alternative to CSS resets
import './utils/vueCommon.js' // 公用的方法，挂载在vue的实例上面，方便通过this.$setStorage的方式来调用
import './filter' // 过滤器，用来处理一些需要转化的数据，比如 强制一个小数点，
import './assets/css/order.css' // 订单的通用样式，

Vue.config.productionTip = false

// new Vue({}) 一定是写在最底部，这样才能确保上面的数据可以正确的挂载到vue实例上

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')