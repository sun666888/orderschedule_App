# delivery-app

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## theme-color 
active: #ff874B
normal: #666666

## 技术点
vue
vuex
vue-router

## 文件夹解释
node_modules => 项目中依赖包的存放目录 <br />
public =>  index.html项目中打包的静态文件<br />
src=> <br />
    assets  => 静态文件目录<br />
        css  => css相关公用文件<br />
        images => 页面中的图片存放<br />
    components => 共用组件<br />
        BottomFoot => 页面底部的切换tab组件<br />
        SvgIcon  => 封装的svgIcon的组件<br />
    directive => vue指令的文件<br />
    filter => 过滤器，比如过滤生成美元符<br />
    icons => svg-icon的组件封装和使用<br />
        svg => 存放的是页面中的svg文件<br />
        index.js => 全局注册svg组件的代码等<br />
    services => 后端交互的接口<br />
        order.service.js => 订单相关的接口文件<br />
        user.service.js => 用户相关的接口文件<br />
    utils => 封装项目常用工具<br />
        createScript.js  => 创建script标签插入到页面中<br />
        fetch.js  => 封装了axios的使用方式，全局请求拦截以及全局的响应拦截<br />
        getLngLat.js => 获取当前的经纬度<br />
        transferLngLat.js => 经纬度转化成地址<br />
        vueCommon.js  => 挂载在vue实例上的公用方法，可以在vue文件中通过this.$spliceArrayOne进行调用<br />
    views => 页面级的组件存放的目录<br />
        errorPage => 当用户输入的路由不存在的时候的一些错误页面的返回<br />
        login  =>  登录相关的页面<br />
        order => 订单相关的页面<br />
        person => 用户相关的页面<br />
    app.vue => 项目的渲染router-view的位置，基本不做修改<br />
    main.js => 项目的入口文件，打包时先读取里面的代码<br />
    router.js => 管理前端的路由配置文件<br />
    store.js => 全局的状态管理，存放一些全局的数据，比如用户名购物车的数量等等<br />
.browserslistrc => 可支持浏览器<br />
.env    =>   全局的常量配置，项目中运用到的全局常量，在此定义<br />
.env.development =>  开发环境下的全局的常量配置<br />
.env.production => 生产环境下的全局的常量配置<br />
.eslintrc.js  => eslint配置相关的文件，用来格式代码<br />
.gitignore  => git忽略的文件<br />
babel.config.js => vant以及其他插件的配置文件<br />
package-lock.json  =>  开发过程中锁定的一些依赖版本<br />
package.json => 项目依赖的文件目录<br />
vue.config.js  => 配置pxtorem或则css规则以及开发环境中的代理转发，已经构建过程中的静态目录的配置<br />
yarn.lock  => yarn工具的锁定版本类似于package-lock.json<br />