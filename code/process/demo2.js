if (cluster.isMaster) {
    const num = os.cpus().length
    console.log('Master cluster setting up ' + num + ' workers...')
    for (let i = 0; i < num; i++) {
        // 按照 CPU 核数，创建 N 个子进程
        cluster.fork()
    }
    cluster.on('online', worker => {
        // 监听 workder 进程上线（启动）
        console.log('worker ' + worker.process.pid + ' is online')
    })
    cluster.on('exit', (worker, code, signal) => {
        // 兼容 workder 进程退出
        console.log('worker ' + worker.process.pid + ' exited with code: ' + code + ' and signal: ' + signal)
        // 退出一个，即可立即重启一个
        console.log('starting a new workder')
        cluster.fork()
    })
}