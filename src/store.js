import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 以上的三步是固定的也是必须的，其实就相当于在vue中加入了vuex插件这个东西

import { loginByname, logOut } from '@/services/user.service.js'

export default new Vuex.Store({
    //  state 用来存储 全局管理的数据， 也是固定的，相当于 仓库， 重要之一
    state: {
        name: '',
        roles: [],
        number: 2
    },
    // mutations 是一个用来同步更改 仓库里面的 全局数据，重要之二， 里面的方法名称都是大写的，说明是 同步的操作，固定的操作，不会有其他变化，所以大写
    mutations: {
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_ROLE: (state, roles) => {
            if (roles.length === 0) {
                state.roles = []
            } else {
                state.roles = roles.split(',')
            }
        },
        SET_NUMBER: (state, number) => {
            state.number = number
        }
    },
    actions: {
        //  actions 它和mutations其实就是一个东西用来修改仓库中 的全局数据，唯一的不同就是在actions中的方法都是通过异步的方式来调用的，然后触发mutations中的方法来修改，仓库中的全局数据。

        // 用户名登录
        LoginByname({ commit }, userInfo) {
            //  2. 异步请求，所以这里返回了promise
            return new Promise((resolve, reject) => {
                // loginByname 是写在user.service.js中的登录方法
                loginByname(userInfo.loginName, userInfo.password).then(response => {
                    const data = response.data
                    commit('SET_NAME', data.user.name)
                    commit('SET_ROLE', data.user.roles)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut ({ commit }) {
            return new Promise((resolve, reject) => {
                logOut().then(response => {
                    commit('SET_NAME', '')
                    commit('SET_ROLE', [])
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})
