var fs = require('fs')
var readStream = fs.createReadStream('./file1.txt')

readStream.on('data', function (chunk) {
    var str = chunk.toString()
    console.log(str.indexOf('bbb'))
    if (str.indexOf('bbb') >= 0) {
        // console.log(str)
    }
})
