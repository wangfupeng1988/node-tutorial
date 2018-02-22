# web 应用

web server 其实就是讲 server 如何处理 http 请求，因为所谓的 web 就是一个一个的 http 请求，server 端拿到请求信息、计算处理、最后返回。http 标准的内容比较多，本文只讲教程相关的部分，推荐看作者写的 [《图解 http》读书笔记](https://github.com/wangfupeng1988/read-notes/blob/master/book/%E5%9B%BE%E8%A7%A3http.md) 去全面了解 http —— 如果想最！最！最！全面了解，那只能去购买《http 权威指南》阅读了，厚厚的枕头书。

---

## 目录

- 基本使用
- url 参数处理
- 路由
- cookie
- 上传文件
- 框架
- 中间件
- 页面渲染
- 问题总结

-----

## 基本使用

### 从 demo 到 http 协议

新建`demo1.js`，内容如下：

```js
var http = require('http')

function serverCallback(req, res) {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.write('<h1>hello nodejs</h1>')
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

命令行运行`node demo1.js`，然后浏览器访问`http://localhost:8080/`（或者命令行`curl http://localhost:8080/`）即可看到结果。这一般是介绍 nodejs 入门的常用 demo ，熟悉 http 协议的同学都知道，这其实就是一个简单的 http 请求处理。

`req`即 request 即请求内容，demo 没有代码演示，下文会补充上。例如`req.method`可以获取请求的方法（如`GET` `POST`等），`req.headers`可获取请求的头，如`accept` `host` `user-agent`等。

`res`即 response 即返回内容，这是 http 请求最基本的内容。`res.writeHead`定义返回的头，包括返回状态码和头信息。`res.write`定义返回的内容，最后`res.end()`表示 server 端处理请求结束。

> PS：这里不会专门讲解 http 协议的细节，不熟悉的同学请看看本文一开始推荐的博客和书籍

### POST 请求

上述处理 get 请求比较简单，能体现 http 协议处理的地方也有限。接下来继续了解一下 nodejs 如何处理 post 请求。

```js
var http = require('http')

function serverCallback(req, res) {
    var method = req.method.toLowerCase() // 获取请求的方法
    if (method === 'get') {
        // 省略 3 行，上文代码示例中处理 GET 请求的代码
    }
    if (method === 'post') {
        // 接收 post 请求的内容
        var data = ''
        req.on('data', function (chunk) {
            // “一点一点”接收内容
            data += chunk.toString()
        })
        req.on('end', function () {
            // 接收完毕，将内容输出
            res.writeHead(200, {'Content-type': 'text/html'})
            res.write(data)
            res.end()
        })
    }
    
}
http.createServer(serverCallback).listen(8080)
```

以上代码即可接收和处理 post 请求，代码中`req.on('data' ...`和`req.on('end', ...`这里，我们作为遗留问题，后面会详细重点的讲解，因为这些也是 nodejs 的重要知识，必须学会的。这里你看下代码注释，只要先知道，post 过来的内容是“一点一点”接收的，然后待接受完再做处理，这样即可。

可以命令行运行`curl -d "a=100&b=200" "http://localhost:8080/"`发起一个 post 请求，其中`a=100&b=200`是请求的主体内容。

### querystring 处理

以上 post 请求的内容格式是 querystring 形式的，即`key1=value1&key2=value2&key3=value3`这种，可以对代码进行改造，将这些数据结构化。

第一，代码最上面加`var querystring = require('querystring')`，引入`querystring`模块，nodejs 自带的。第二，对`req.on('end', ...`的内容做如下修改：

```js
req.on('end', function () {
    // res.writeHead(200, {'Content-type': 'text/html'})
    // res.write(data)
    data = querystring.parse(data) // 结构化为 JSON 格式
    res.writeHead(200, {'Content-type': 'application/json'})  // 返回头，改为 JSON 格式
    res.write(JSON.stringify(data)) // res 只能输出字符串或者 Buffer 类型，因此这里只能 JSON.stringify 之后再输出
    res.end()
})
```

### post 内容为 JSON 格式

以上 post 请求的内容格式是 querystring 形式，一般用于网页的`<form>`提交，打印`req.headers['content-type']`的值是`application/x-www-form-urlencoded`，即是`<form>`提交的方式 —— 虽然是用`curl`模拟的。

而现在网页中数据提交大部分使用 ajax ，数据格式也改为了 JSON 格式，且看 nodejs 如何处理

```js
var http = require('http')

function serverCallback(req, res) {
    var method = req.method.toLowerCase()
    var contentType = req.headers['content-type']
    if (method === 'post') {
        if (contentType === 'application/x-www-form-urlencoded') {
            // 省略 N 行
        }
        if (contentType === 'application/json') {
            var data = ''
            req.on('data', function (chunk) {
                data += chunk.toString()
            })
            req.on('end', function () {
                data = JSON.parse(data) // post 的数据为 JSON 格式，因此直接可以转换为 JS 对象
                res.writeHead(200, {'Content-type': 'application/json'})
                res.write(JSON.stringify(data)) // res 只能输出字符串或者 Buffer 类型，因此这里只能 JSON.stringify 之后再输出
                res.end()
            })
        }
    }
    
}
http.createServer(serverCallback).listen(8080)
```

可以使用`curl -l -H "Content-type: application/json" -X POST -d '{"name":"zhangsan","age":25}' http://localhost:8080/`发起 post 请求，并且规定格式为 JSON，内容即`{"name":"zhangsan","age":25}`

### 总结

之前学习其他后端语言可能没这么费劲，接触不到这么底层的 http 协议的操作，那是因为它们都已经做好了框架的封装，并不是它们真的不需要。通过 nodejs 学习一下 http 协议的具体操作也绝对是好事一桩，不要抱怨。

另外，nodejs 虽然没有提供官方的 web 框架，但是也不会傻乎乎的在项目中直接写这么底层的代码，下文会介绍 nodejs 社区中非常成熟的 web 框架，到时候这些 http 协议的操作，也都有简单的 API 可使用。

-----

## url 参数处理

通过`req.url`可以获得请求网址的完整内容，其中比较重要的就是：路由和参数。路由下文讲，先说参数的处理。

完整的 url 肯定是字符串形式的，是非结构化的，要想结构化需要引入 nodejs 提供的`url`模块，即`var url = require('url')`，然后通过`var urlData = url.parse(req.url)`进行结构化。

从结构化之后的数据中，通过`urlData.query`即可轻松拿到 url 参数。代码示例如下：

```js
var http = require('http')
var url = require('url')

// 处理 url 参数
function serverCallback(req, res) {
    var urlData = url.parse(req.url) // 结构化 url 内容，变为 JS 对象
    var query = urlData.query
    console.log(query)

    // ……
}
http.createServer(serverCallback).listen(8080)
```

但是得到的 url 参数还是字符串，非结构化的，不好处理。这里引用`var querystring = require('querystring')`，然后`query = querystring.parse(query)`即可了。完整代码如下：

```js
var http = require('http')
var url = require('url')
var querystring = require('querystring')

// 处理 url 参数
function serverCallback(req, res) {
    var urlData = url.parse(req.url) // 结构化 url 内容，变为 JS 对象
    var query = urlData.query
    query = querystring.parse(query)  // 结构化 query 内容，变为 JS 对象

    res.writeHead(200, {'Content-type': 'text/html'})
    res.write(JSON.stringify(query))
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

使用`curl http://127.0.0.1:8080/?a=1&b=2`即可看到结果。

-----

## 路由

通过`urlData.query`可以获取 url 参数，通过`urlData.pathname`可以获取路由，代码如下

```js
var http = require('http')
var url = require('url')

function serverCallback(req, res) {
    var urlData = url.parse(req.url)
    var pathname = urlData.pathname // 获取 url 路由

    res.writeHead(200, {'Content-type': 'text/html'})
    res.write(pathname)
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

可以通过`curl curl http://127.0.0.1:8080/api/getname`来验证。

这里演示比较简单，但是路由处理却是 web server 中非常重要而且应用场景非常复杂的模块，而且路由如何设计也非常重要。其复杂性可以总结以下几点（未考虑到的欢迎补充）：

- **不同的 method**：如针对`/api/getname`，get 方法请求和 post 方法请求，要能区分开来
- **不同的参数规则**：如`/api/getname/:id`表示必须有`id`参数，`/api/getname(/:id)`表示`id`可有可无
- **层级关系**：如`/api/getname`和`/api/setname`都有`api`这个层级，要能支持两者共享流程
- ……

（是很复杂吧？）因此，一般路由的处理，都会根据一个 web 框架选择比较成熟的路由库，如 [koa-router](https://www.npmjs.com/package/koa-router) 。

**【以下为扩展内容】**

路由设计，当下比较流行`RESTful API`的思想。简单说来，就是将每个 url 都当做一个独立的资源，通过 method 规定这次请求的操作方式，如`get` `post` `put` `delete`等。有点类似于 linux 将所有内容都抽象为文件，都符合标准输入输出。如下代码：

```js
router
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', (ctx, next) => {
    // ...
  })
  .put('/users/:id', (ctx, next) => {
    // ...
  })
  .del('/users/:id', (ctx, next) => {
    // ...
  })
  .all('/users/:id', (ctx, next) => {
    // ...
  });
```

`RESTful API`设计思想给出了 API 设计的标准，前端数据请求也将因此而更加规整，后续肯定会慢慢推广普及开来。

-----

## cookie

```js
var http = require('http')

function serverCallback(req, res) {
    res.writeHead(200, {
        'Content-type': 'text/html',
        // 'Set-Cookie': 'a=100'           // 设置单个值
        'Set-Cookie': ['a=100', 'b=200']   // 这是多个值
    })
    res.write('hello nodejs')
    res.end()
}
http.createServer(serverCallback).listen(8080)
```

以上代码演示了如何`Set-Cookie`，浏览器访问`http://localhost:8080/`之后，前端即存储了 cookie 。然后再次访问，看通过`req.headers.cookie`获取到 cookie 内容。

cookie 的知识都是 http 协议的内容，这里几个 API 不足以涵盖，不熟悉的同学要去学习 http 协议的知识。cookie 是网络请求中非常重要的内容，必须掌握。

**【扩展】**

cookie 应用比较典型的场景是 —— 登录。而且，cookie 要结合 server 端的 session 才能完成整个登录的功能。这是一个比较复杂而且独立的场景，具体使用应该放在一个实战项目中讲解更为合适，这里不详细赘述。

简单描述一下。前端通过登录表单将用户名和密码发送到 server 端，server 端如果验证成功，即通过`Set-Cookie`设置一个`cookie`值，如`session_id=xxxx`，并且设置 20分钟 有效期，以及`httpOnly`（前端 JS 不能访问）。以后每次网络请求，server 端都通过判断是否有`session_id`来确定用户是否登录，以及通过`session_id`的值，对应到内存中的一些数据，这些数据即 server 端未用户存储的信息。

针对登录场景操作 cookie 和 session ，针对 web 框架有专门的工具供使用，不用自己手动写。例如 [koa-session](https://www.npmjs.com/package/koa-session)

-----

## 上传文件

HTML 中普通表单和特殊表单的区别就在于是否有`<file>`标签。如果需要有`<file>`标签，就需要指定表单需求 **`enctype`为`multipart/form-data`**

```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <input ... >
    <file ... >
</form>
```

nodejs 可判断`Content-type`值为`multipart/form-data`来确定是文件上传的请求。这是一个比较特殊的场景，特别是在互联网 web server 中，nodejs 用来做上传文件的接口是否合适还需论证。如果真的有地方需要用，推荐使用 [formidable](https://www.npmjs.com/package/formidable) 工具，比较简单。

-----

## 框架

nodejs 的 web server 框架，比较常用的有 [express](http://www.expressjs.com.cn/) 和 [koa](https://koa.bootcss.com/) ，两者使用起来差别不是特别大 —— 因为两者的作者是同一个人（或者同一个团队）。两者的不同如下：

- **这对异步**：koa 支持最新的 ES7 草案中`async/await`语法，express 还是用的 callback 形式
- **社区**：express 社区更加完善，插件更多；koa 相对来说社区、插件都少一些，不过发展这些年了也能满足日常需求

如果项目要做选择，我会这么推荐：

- 中小型项目，允许尝试新技术、踩新坑，船小也好调头，推荐使用 koa
- 大型项目，时间紧急，满足需求和稳定第一，那就使用 express

但是我们作为前端程序猿，两者必须都了解，不熟悉的同学至少要去官网看下文档，做几个 demo 玩一玩。

-----

## 中间件

框架提供给开发者的便利的地方有：

- 封装`req`和`res`接口
- 封装路由处理
- 提供中间件机制

其中，中间件对于我们前端开发者来说，算是一个比较新的概念（虽然它早就存在）。简单说来，中间件就是将一次请求的处理拆分成许多小部分，分而治之。这样做完全符合开放封闭原则，可以复用也可以扩展。例如 express 的代码示例

```js
var app = express();

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 路由和句柄函数(中间件系统)，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});
```

express 总结的中间件有以下几种：

- **应用级中间件** 公共功能的中间件，例如日志记录、获取公共数据
- **路由级中间件** 针对路由不同功能的中间件，用于业务处理
- **错误处理中间件** 用于捕获异常
- **内置中间件** 最常用的中间件，例如`express.static`是 express 内置的中间件，用于返回静态文件
- **第三方中间件** 一个框架要保证扩展性，肯定得支持第三方开发者贡献自己的代码

本文主要讲解 nodejs 基础知识，框架的内容不会详细介绍，可以自己去看文档。

-----

## 页面渲染

nodejs 没有御用的模板引擎，这一点不像 php asp jsp 等，需要自己去选择，例如 artTemplate 。书中也简单讲解了实现一个模板引擎的逻辑，我之前了解过 vue 中模板的解析，因此对这块逻辑也不算陌生。另外，模板解析的逻辑，大概了解即可，也无需详细深入，毕竟是工具性的东西。这里先略过。

**【扩展】Bigpipe**

普通的页面渲染，即便是首屏渲染，也是拿到所有该拿的数据之后，一次性吐出给前端。**而 Bigpipe 是将页面内容分成了多个部分（pagelet），然后分批逐步输出**。

首先，要向前端输出模板和接收 pagelet 的方法，其实就是一个 JS 方法，该方法接收 DOM 选择器和内容，然后将内容渲染到 DOM 节点中。接下来，server 端异步请求数据，然后分批输出到前端去渲染，如下代码。nodejs 异步请求是部分顺序的，因此下面两个异步，哪个先输出不知道——也无需知道，先查询出来的先输出即可。

```js
app.get('/profile', function (req, res) {
    var num = 0
    db.getData('sql1', function (err, data) {
        res.write('<script>bigpipe.set("articles", "' + JSON.stringify(data) + '")</script>')
        num++
        if (num === 2) {
            res.end()  // 结束请求
        }
    })
    db.getData('sql2', function (err, data) {
        res.write('<script>bigpipe.set("copyright", "' + JSON.stringify(data) + '")</script>')
        num++
        if (num === 2) {
            res.end()  // 结束请求
        }
    })
})
```

这种多 pagelet 分批下发的方式，ajax 也可以办到。但是 ajax 每次都是一个独立的 http 请求，而 Bigpipe 共用相同的请求，开销十分小。

----

## 遗留问题

上文中，有一段`req.on('data' ...`和`req.on('end', ...`代码没有详细介绍，现在关注两点：

- `req.on`这里的`on`是特定的吗？
- 这里的`data`和`end`是特定的吗？

下面将用两节内容讲解这两个疑问。
