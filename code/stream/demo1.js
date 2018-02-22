
// // demo 1
// process.stdin.on('data', function (chunk) {
//     console.log(chunk.toString())
// })

// demo 2
// var fs = require('fs')
// var readStream = fs.createReadStream('./file1.txt')
// var length = 0
// readStream.on('data', function (chunk) {
//     // console.log(chunk instanceof Buffer)
//     length += chunk.toString().length
// })
// readStream.on('end', function () {
//     console.log(length)
// })

// // demo 3
// process.stdin.pipe(process.stdout)

// // demo 4
// var fs = require('fs')
// var readStream = fs.createReadStream('./file1.txt')
// var writeStream = fs.createWriteStream('./file2.txt')
// readStream.pipe(writeStream)

// // demo 5
// var http = require('http')
// var fs = require('fs')
// function serverCallback(req, res) {
//     var readStream = fs.createReadStream('./file1.txt')
//     res.writeHead(200, {'Content-type': 'text/html'})
//     readStream.pipe(res)
// }
// http.createServer(serverCallback).listen(8080)

// // demo 6
// var fs = require('fs')
// var zlib = require('zlib')
// var readStream = fs.createReadStream('./file1.txt')
// var writeStream = fs.createWriteStream('./file1.txt.gz')
// readStream.pipe(zlib.createGzip()).pipe(writeStream)

// demo 7
// var http = require('http')
// var fs = require('fs')
// var zlib = require('zlib')
// function serverCallback(req, res) {
//     var readStream = fs.createReadStream('./file1.txt')
//     res.writeHead(200, {'Content-type': 'application/x-gzip'})
//     readStream.pipe(zlib.createGzip())
//               .pipe(res)
// }
// http.createServer(serverCallback).listen(8080)



