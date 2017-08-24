## loader

+ js => babel-loader

+ css => css-loader,style-loader

+ sass => sass-loader

+ 字体，图片 => file-loader,url-loader



## plugin

+ html-webpack-plugin

### 多页面的配置文件

1. 获取src目录下所有入口文件的路径
```
var glob = require('glob');
var path = require('path');
var chalk= require('chalk');
var fs= require('fs');
var ENTRY = 'main.js'
var Page_Folder = path.resolve(__dirname, '../src');
var Pages = Page_Folder + '/*/' + ENTRY;
var TEMPLATE= 'index.html'
function initPages() {
  var pages= {};
//同步获取文件 获取匹配对应规则的文件
  glob.sync(Pages).forEach(function (entry) {
    var pageName = getPageName(entry);
    var templatePath= getTemplatePath(entry);

    if (!fs.existsSync(templatePath)) {
      return
    }
    pages[pageName] = {
      name: pageName,
      entry: entry,
      template: templatePath
    }
  })
  return pages;
}


function getPageName(filePath) {
  return filePath.substring(Page_Folder.length + 1, filePath.indexOf(ENTRY) - 1)
}

function getTemplatePath (filePath) {
  var templatePath = filePath.substring(0, filePath.indexOf(ENTRY))
  templatePath += TEMPLATE
  return templatePath
}

module.exports= initPages();
```

2. 生成webpack的多入口entry和html-wbpack-plugin配置项

```
var pages= require('./page.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')

exports.getEntry = function () {
  var entry = {}
  Object.keys(pages).forEach(function (name) {
    entry[name] = [ 'babel-polyfill',pages[name].entry]
  })
  return entry
}

exports.getHtmlPlugin = function () {
  return Object.keys(pages).map(function (name) {
    return new HtmlWebpackPlugin({
      template: pages[name].template,
      filename: name + '.html',
      inject: true,
      chunks: ["manifest","vendor-dll","commons",name],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode:  'dependency'
    })
  })
}
```

+ DllPlugin配合DllReferencePlugin对公共的模块进行抽取。需要新建一个单独的dll打包配置文件

+ CommonsChunkPlugin对公共的引用文件进行分离，防止重复打包

+ ExtractTextPlugin实现将css抽离出来

+ 跨域请求接口，配置代理，使用http-proxy-middleware





