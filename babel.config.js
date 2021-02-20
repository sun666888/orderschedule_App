module.exports = {
    presets: [
        '@vue/app'
    ],
    // 使用vant组件必须配置项，参考https://youzan.github.io/vant/#/zh-CN/quickstart
    plugins: [
        [
            'import',
            { libraryName: 'vant', libraryDirectory: 'es', style: true },
            'vant'
        ]
    ]
}