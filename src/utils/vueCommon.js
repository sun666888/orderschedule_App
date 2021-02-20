// 这里import Vue from 'vue' 对这个文件是必须的，因为下面的方法都是基于Vue这个实例来做的
import Vue from 'vue'

//  判断如果 history中浏览记录的长度值 小于等于1的时候，那么就在路由上面  添加一个？goindex=true     也就是如果首次在浏览器中输入我们的网站地址，localhost：8080  网址会变成 localhost:8080?goindex=true
Vue.prototype.$setgoindex = function() {
    if (window.history.length <= 1) {
        if (location.href.indexOf('?') === -1) {
            window.location.href = location.href + '?goindex=true'
        } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
            window.location.href = location.href + '&goindex=true'
        }
    }
}

//  移除数组中的某一项
Vue.prototype.$spliceArrayOne = function(arrays, one) {
    let findIndex = arrays.findIndex(x => x.id === one)
    arrays.splice(findIndex, 1)
}

// 将值存放到localStorage中
Vue.prototype.$setStorage = function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

// 获取某一个key对应的存放在localStorage的值
Vue.prototype.$getStorage = function(key) {
    console.log(window.localStorage.getItem(key))
    return window.localStorage.getItem(key)
}

// 移除某个key对应的存放在localStorage的值
Vue.prototype.$removeStorage = function(key) {
    window.localStorage.removeItem(key)
}

// 这里是直接通过 Vue.prototyp.$removeStorage 这样来 在原型中增加了一个 removeStorage方法
//  在vue文件中可以直接通过  this.$removeStorage的方法来调用。
// 其实也是相当于  封装了一些项目中比较常用的方法，然后方便去调用