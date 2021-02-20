const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

//  vue.config.js是在项目开始之前将能想到的东西都配置好，然后在进行开发。所以这是非常总要的第一步

module.exports = {
    outputDir: process.env.outputDir,
    lintOnSave: true,

    // 重要的地方！！！！！！

    //  publicPath 也就是在npm run build的时候，判断如果是 npm run build 那么就在所有的静态文件之前 加上/orderschedule_test/orderschedule_app/  + 之前的路径
    // 比如在<img src="../../assets/images/head.png" alt="error" class="header-img"> 在person.vue中，这个静态的img打包后，的地址  是   orderschedule_showorderschedule_app/img/head1231231731.png
    // publicPath: process.env.NODE_ENV === 'production' ? '/orderschedule_test/orderschedule_app' : './',
    publicPath: process.env.NODE_ENV === 'production' ? '/orderschedule/orderschedule_app' : './',
    productionSourceMap: process.env.NODE_ENV !== 'production',
    chainWebpack: (config) => {
        //  在使用svg的时候也必须加上以下的这些参数

        config.resolve.alias.set('@images', resolve('./src/assets/images'))
        config.resolve.alias.set('@svg', resolve('./src/icons/svg'))
        config.module.rules.delete('svg')
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(resolve('src/icons/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })

        config.module
            .rule('css')
            .test(/\.css$/)
            .oneOf('vue')
            .resourceQuery(/\?vue/)
            .use('px2rem')
            .loader('px2rem-loader')
            .options({
                remUnit: 75
            })
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-plugin-px2rem')({
                        rootValue: 75, // 换算基数，750设计稿，rootValue：75  设计图中多少px直接在项目中写多少px
                        exclude: /(node_module)/, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                        mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
                        minPixelValue: 0 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
                    })
                ]
            }
        }
    },

    devServer: {
        open: true,
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            '/orderschedule': {
                target: 'https://www.shyy6688.com',
                changeOrigin: true
            }
        },
        before: app => {}
    }
}
