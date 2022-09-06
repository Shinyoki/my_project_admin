const {defineConfig} = require('@vue/cli-service')

const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: true,
    devServer: {
        port: 8848,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8888',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
    configureWebpack: {
        name: "我的项目",
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
    },
})
