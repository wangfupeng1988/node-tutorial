# 换个思路学习 nodejs

nodejs 是一种将 JS 作为语言的 server 端开发技术 —— 说起来容易，但是真正理解起来，还是得费点时间的。因此，不同的理解方式和学习思路，对于最后学习的效率和效果都会有影响。nodejs 虽然说起来功能很强大，**不过现在普遍用于 web server 中，那就从这里入手最为合适**。

你会发现，从最常用的 web server 入手，逐步深入，就会遇到各个 nodejs 中的核心知识点，例如 emit stream buffer promise 等等。**遇到这些问题之后，要放在实际的 web server 场景中各个击破，这样才能深刻理解**。否则，光根据 API 看文档介绍，看过了你也不能深刻记忆，因为不知道怎么用。

文章目录如下：

- [语法特性](./docs/01-语法.md)
    - 和浏览器环境 JS 的不同
    - 模块化
    - 异步
- [web 应用](./docs/02-web-应用.md)
    - 基本使用
    - url 参数处理
    - 路由
    - cookie
    - 上传文件
    - 框架
    - 中间件
    - 页面渲染
- [事件](./docs/03-事件.md)
    - 观察者模式
    - EventEmitter 基本使用
    - EventEmitter 继承
- [Stream & Buffer](./docs/04-Stream-Buffer.md)
    - 为何要“一点一点”的？
    - 如何才能“一点一点”的？
    - “流”
    - 从哪里来？
    - 到哪里去？
    - 有没有中转站？
    - 是什么在流动？
- [异步 IO](./docs/05-异步-IO.md)
    - JS 单线程异步的特性
    - 什么是 IO ？
    - 多线程 web server
    - 异步 IO
    - 异步编程的问题
- [玩转进程](./docs/06-进程.md)
    - 为何要启用多进程（利用 CPU 、避免 v8 内存限制）
    - child_process
    - cluster 和 pm2
- [其他](./docs/07-其他.md)
    - 关于数据存储（如 mysql redis 等）

文章中的示例代码，都在 [code](./code) 目录下
