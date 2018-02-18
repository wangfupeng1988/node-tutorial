var http = require('http')
var url = require('url')
var querystring = require('querystring')

// // 处理 url 参数
// function serverCallback(req, res) {
//     var urlData = url.parse(req.url) // 结构化 url 内容，变为 JS 对象
//     var query = urlData.query
//     query = querystring.parse(query)

//     res.writeHead(200, {'Content-type': 'text/html'})
//     res.write(JSON.stringify(query))
//     res.end()
// }
// http.createServer(serverCallback).listen(8080)

// 处理路由
function serverCallback(req, res) {
    var urlData = url.parse(req.url)
    var pathname = urlData.pathname

    res.writeHead(200, {'Content-type': 'text/html'})
    res.write(pathname)
    res.end()
}
http.createServer(serverCallback).listen(8080)


