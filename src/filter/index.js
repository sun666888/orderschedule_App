import Vue from 'vue'

// 强制保留一位小数
Vue.filter('decimalPoint', function(value) {
    // 全局写一些vue的过滤去，然后再页面中可以直接使用 ‘|’ 管道符来使用该过滤器

    let newValue = Math.round(parseFloat(value) * 100) / 100
    let xsd = newValue.toString().split('.')
    if (xsd.length === 1) {
        newValue = newValue.toString() + '.0'
        return newValue
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            newValue = newValue.toString()
        }
        return newValue
    }
})