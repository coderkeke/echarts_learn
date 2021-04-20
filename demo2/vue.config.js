module.exports = {
    //基本路径
    publicPath: './',
    //构建时的输出目录
    outputDir: "dist",
    //放置静态资源的目录
    assetsDir: "static",
    //html的输出路径
    indexPath: "index.html",
    //文件名哈希
    filenameHashing: true,
    //  是否在保存的时候使用 `eslint-loader` 进行检查。
    lintOnSave: true,
    //  是否使用带有浏览器内编译器的完整构建版本
    runtimeCompiler: false,
    //  是否为生产环境构建生成 source map？
    productionSourceMap: true,
    devServer: {
        port: 8000,
        open: true,
        https: false,
        hotOnly: false,
    },
    configureWebpack: {
        //配置路径别名
    }
}