// vue.config.js
module.exports = {
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
            args[0].title = 'Ajuste de Segmento via API'
            return args
        })
    }
}