var http = require('http')
var querystring = require('querystring')

// cookie
function serverCallback(req, res) {
    console.log(req.headers.cookie)
    res.writeHead(200, {
        'Content-type': 'text/html',
        // 'Set-Cookie': 'a=100'
        'Set-Cookie': ['a=100', 'b=200']
    })
    res.write('hello nodejs')
    res.end()
}
http.createServer(serverCallback).listen(8080)