var http = require('http')
var querystring = require('querystring')

// // 处理 get 请求
// function serverCallback(req, res) {
//     console.log(req.headers)
//     res.writeHead(200, {'Content-type': 'text/html'})
//     res.write('hello nodejs')
//     res.end()
// }
// http.createServer(serverCallback).listen(8080)


// // 处理 post 请求 ，form 提交
// function serverCallback(req, res) {
//     var method = req.method.toLowerCase()
//     if (method === 'get') {
//         res.writeHead(200, {'Content-type': 'text/html'})
//         res.write('hello nodejs')
//         res.end()
//     }
//     if (method === 'post') {
//         var data = ''
//         req.on('data', function (chunk) {
//             data += chunk.toString()
//         })
//         req.on('end', function () {
//             // res.writeHead(200, {'Content-type': 'text/html'})
//             // res.write(data)
//             data = querystring.parse(data)
//             res.writeHead(200, {'Content-type': 'application/json'})
//             res.write(JSON.stringify(data))
//             res.end()
//         })
//     }
    
// }
// http.createServer(serverCallback).listen(8080)


// 处理 post 请求，json 格式
function serverCallback(req, res) {
    var method = req.method.toLowerCase()
    var contentType = req.headers['content-type']
    if (method === 'post') {
        if (contentType === 'application/x-www-form-urlencoded') {
            var data = ''
            req.on('data', function (chunk) {
                data += chunk.toString()
            })
            req.on('end', function () {
                // res.writeHead(200, {'Content-type': 'text/html'})
                // res.write(data)
                data = querystring.parse(data)
                res.writeHead(200, {'Content-type': 'application/json'})
                res.write(JSON.stringify(data))
                res.end()
            })
        }
        if (contentType === 'application/json') {
            var data = ''
            req.on('data', function (chunk) {
                data += chunk.toString()
            })
            req.on('end', function () {
                data = JSON.parse(data)
                res.writeHead(200, {'Content-type': 'application/json'})
                res.write(JSON.stringify(data))
                res.end()
            })
        }
    }
    
}
http.createServer(serverCallback).listen(8080)

