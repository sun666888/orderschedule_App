import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 以上三行的代码是固定的，而且是必须的。

const routes = [{
        name: '/',
        component: () =>
            import ('./views/login/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        name: 'person',
        component: () =>
            import ('./views/person/Person.vue'),
        meta: {
            title: '个人'
        }
    },
    {
        name: 'order',
        component: () =>
            import ('./views/order/Order.vue')
    },
    {
        name: 'undone',
        component: () =>
            import ('./views/order/UnDone.vue'),
        meta: {
            title: '订单'
        }
    },
    {
        name: 'editOrder',
        component: () =>
            import ('./views/order/EditOrder.vue'),
        meta: {
            title: '编辑订单'
        }
    },
    {
        name: 'information',
        component: () =>
            import ('./views/order/Information.vue'),
        meta: {
            title: '人员信息登记'
        }
    },
    {
        name: '404',
        component: () =>
            import ('./views/errorPage/404.vue'),
        meta: {
            title: 'Oops'
        }
    },
    {
        path: '*',
        redirect: '/404'
    }
]

// add route path
routes.forEach(route => {
    route.path = route.path || '/' + (route.name || '')
})

//  router.forEach相当于把routes遍历了一遍，将每个对象中的path的值，都是等于 /name   也就是比如 name = 'person'的这一个路由，遍历后的  path = '/person'
//  其实可以直接在页面中， 显式的写出 path，而不用去遍历再去添加，通过遍历在去添加的目的是为了节省代码。

const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

// mode: 'hash'   都采用这个方式来做，
// mode: history  当在发布的时候需要后台来配合，需要修改nginx中的配置文件，会导致静态文件出现丢失的情况
// mode: 'hash'  所以在开发的实际过程中都采用hash来管理路由，这样你在发布的时候，路由可以通过 前端来管理，而不必去后台进行修改nginx的配置，简化操作。唯一的不同就是路由中多了 # 而已

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title
    if (title) {
        document.title = title
    }
    next()
})

//  router.beforeEach中其实是一个路由拦截，简单的理解，从home跳转到了order页面，就是就会经过这一个路由的拦截。
//  上面的这一个路由拦截就是,将在routes中配置的meta中title页面的标题写在title标签中

export default router
// 将路由的实例暴露出去,确保其他地方可以调用,
