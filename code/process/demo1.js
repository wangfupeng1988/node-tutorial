const cluster = require('cluster')
const os = require('os')
const http = require('http')

if (cluster.isMaster) {
    console.log('是主进程')
    const cpus = os.cpus() // cpu 信息
    const cpusLength = cpus.length  // cpu 核数
    for (let i = 0; i < cpusLength; i++) {
        // fork() 方法用于新建一个 worker 进程，上下文都复制主进程。只有主进程才能调用这个方法
        // 该方法返回一个 worker 对象。
        cluster.fork()
    }
} else {
    console.log('不是主进程')
    // 运行该 demo 之后，可以运行 top 命令看下 node 的进程数量
    // 如果电脑是 4 核 CPU ，会生成 4 个子进程，另外还有 1 个主进程，一共 5 个 node 进程
    // 其中， 4 个子进程受理 http-server
    http.createServer((req, res) => {
        res.writeHead(200)
        res.end('hello world')
    }).listen(8000)  // 注意，这里就不会有端口冲突的问题了！！！
}