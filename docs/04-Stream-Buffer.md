# Stream 和 Buffer

本节解决 [web 应用](./02-web-应用.md) 这一节最后的遗留问题“**这里的`data`和`end`是特定的吗？**”

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
req.on('end', function () {

})
```

上一节解决了`on`这个 API ，知道是自定义函数，但是这里的`data`和`end`又是哪里规定的，以及代码注释中的`“一点一点”接收内容`又是什么意思，本节将通过 Stream 来解惑。

另外，本文不会非常全面的介绍 Stream ，只会从 web server 的角度讲解最常用、最容易理解的 Stream 的功能。**全面了解 Stream 欢迎移步 stream-handbook 这篇经典博客**，[英文原文](https://github.com/substack/stream-handbook) [中文翻译](https://github.com/jabez128/stream-handbook)。

-----

## 目录

- 为何要“一点一点”的？
- 如何才能“一点一点”的？
- “流”
- 从哪里来？
- 到哪里去？
- 有没有中转站？
- 是什么在流动？
- 总结（回顾问题）

---

## 为何要“一点一点”的？

你去视频网站看电影，去下载比较大的软件安装包，或者上传电影、软件包到云盘，这些文件都是动辄几个 G 大小，对吧？然而，我们的内存、网络、硬盘读写都是有速度或者大小的限制的，不可能随便的“生吞活剥”任何大文件，于是不得不“一点一点”的。

就像我们吃东西。我们牙齿的咀嚼食物的速度是有限制的，食道和食管也是有限制的，这种情况下，我们吃任何大小的东西，都得“一点一点”的来，无论是大馒头还是小包子。

专业一点说：**一次性读取、操作大文件，内存和网络是“吃不消”的**。

----

## 如何才能“一点一点”的？

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
req.on('end', function () {

})
```

如上代码，我们已经知道了`on`是监听事件的触发，分别监听`data`和`end`两个事件。顾名思义，`data`就是有数据传递过来的事件，`end`就是结束的事件。那就可以通过这段代码回答这个问题。

如何做到“一点一点”的？—— **有数据传递过来就触发`data`事件，接收到这段数据，暂存下来，最后待数据全部传递完了触发`end`事件**。为何要在上一节先把事件机制给讲了？因为这儿就是一句事件机制才能实现。

----

## 流

上面说的这种“一点一点”的操作方式，就是“流”，Stream 。它并不是 nodejs 独有的，而是系统级别的，linux 命令的`|`就是 Stream ，因此所有 server 端语言都应该实现 Stream 的 API 。

我们用桶和水来做比喻还算比较恰当（其实计算机中的概念，都是数学概念，都是抽象的，都无法完全用现实事务做比喻），如下图。数据从原来的 source 流向 dest ，要向水一样，慢慢的一点一点的通过一个管道流过去。

![](https://images2018.cnblogs.com/blog/138012/201802/138012-20180222173741652-978565681.png)

上图是一个完整的流程，对于流的操作，不一定非得必须完整。如上文的代码，我们仅仅实现了 source 的出口部分，管道和 dest 都没有实现。即，我们通过`data`和`end`事件能监听数据的流出或者来源，然后拿到流出的数据我们做了其他处理。


----

## 从哪里来

上文和上图都说，数据从一个地方“流”向另一个地方，那先看看数据的来源。大家先想一下，作为一个 server 端的程序，我们一般能从哪些地方能接受到数据，或者数据能从哪些地方“流”出来？（我想了一下，就想到下面三个常用的，如果有其他的后面再补充吧）

- http 请求，上文代码的`req`
- 控制台，标准输入 stdin
- 文件，读取文件内容

其实，所有的数据来源，都可以用 Stream 来实现。下面挨个看一下，体会一下 Stream 是怎么参与进来的：

### http req

再次回顾上文代码，看 Stream 是如何“一点一点”获取 req 数据的

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
req.on('end', function () {

})
```

### 控制台输入

nodejs 作为 web server ，基本不会用到控制台输入的功能，但是为了验证 Stream 的使用，这里就简单弄个 demo 演示一下：

```js
process.stdin.on('data', function (chunk) {
    console.log(chunk.toString())
})
```

自己去运行一下看看结果，每输入一行就会输出相同内容。这就证明每次输入之后，都会触发`data`事件，用到了 Stream 。

### 读取文件

为何使用 Stream 的道理，上文讲的很清楚了，因此在读取文件中就直接使用了，不再解释。

```js
var fs = require('fs')
var readStream = fs.createReadStream('./file1.txt')  // 读取文件的 Stream

var length = 0
readStream.on('data', function (chunk) {
    length += chunk.toString().length
})
readStream.on('end', function () {
    console.log(length)
})
```

如上代码，要用 Stream 那就肯定不能直接使用`fs.readFile`了，而是使用`fs.createReadStream` 。它返回的是一个 Stream 对象，通过监听其`data`和`end`来处理相关操作。

### Readable Stream

以上提到的所有能产出数据的 Stream 对象，都叫做 Readable Stream ，即可以从中读取数据的 Stream 对象。Readable Stream 对象可以监听`data` `end`事件，还有一个`pipe` API（下文会重点介绍）。你可以通过 [构造函数](http://nodejs.cn/api/stream.html#stream_implementing_a_readable_stream) 来实现一个自定义的 Readable Stream （上文三个也不过是继承、实现了这个构造函数而已）。不过一般情况下，我们无需这么做，因此这里了解一下即可。

----

## 到哪里去

知道了从哪里来，就得知道往哪里去。还是同样的思考方法，想一下一个 server 端程序，数据通常会“流”向何方？

- 控制台，标准输出
- 文件，写入文件内容
- http 请求，res

同理，涉及到数据“流”入的程序，也都可以用 Stream 来操作，而且要介绍一个新的 API —— **`pipe` ，它会自动将数据从 srouce 导流向 dest** ，就上上文的图一样。可以通过下面的例子来体会。

### 控制台，标准输出

```js
process.stdin.pipe(process.stdout)
```

拿这句代码是对比上文中的图（source 管道流向 dest），是不是一样？从中体会一下`pipe`的作用，有了`pipe`我们就不用去关心下面代码中的`chunk`了（关于`chunk`是什么，下文会详细介绍，暂时先不管），也不用去手动监听`data` `end`事件了。

```js
process.stdin.on('data', function (chunk) {
    console.log(chunk.toString())
})
```

### 写入文件

```js
var fs = require('fs')
var readStream = fs.createReadStream('./file1.txt')
var writeStream = fs.createWriteStream('./file2.txt')
readStream.pipe(writeStream)
```

`fs.createReadStream`可以创建一个文件的可读流，对应的`fs.createWriteStream`可以创建一个可写流，通过`pipe`将他们联通。这样它们就能像上文图中那样，数据从`file1.txt`通过一根管子一点一点的流向了`file2.txt`。

这就是复制大文件的方式，**不是先读后写，而是边读边写……**

### http res

根据上面两个 demo 下面的代码应该也比较好理解了，下面的代码写的就是读取`file1.txt`内容然后通过 http 协议返回。浏览器访问`http://localhost:8080/`即可看到效果，很简单。

```js
var http = require('http')
var fs = require('fs')
function serverCallback(req, res) {
    var readStream = fs.createReadStream('./file1.txt')
    res.writeHead(200, {'Content-type': 'text/html'})
    readStream.pipe(res)
}
http.createServer(serverCallback).listen(8080)
```

我们来将这段代码和 [web 应用](./02-web-应用.md) 这一节中的 demo ，关键代码对比一下

```js
// 之前的 demo
res.writeHead(200, {'Content-type': 'text/html'})
res.write('hello nodejs')
res.end()

// 这里的代码
var readStream = fs.createReadStream('./file1.txt')
res.writeHead(200, {'Content-type': 'text/html'})
readStream.pipe(res)
```

对比看来，`res.writeHead`该怎么写还是怎么写，不受影响。主要的就是之前的`res.write('hello nodejs')`换成了`readStream.pipe(res)`，之前是一次性输出内容，现在是通过 Stream 一点一点输出内容。

最后，之前的`res.end()`在当前的代码中没写，不过不会影响我们代码的运行，因为`readStream.pipe(res)`执行的时候，会自动监听到`end`事件然后执行`res.end()`，因此不需要我们手动再写一遍。

> PS：在下文我们会提到，使用 Stream 处理 http res 会提高性能。因为这样直接输出的是二进制，而`res.write('hello nodejs')`输出的是字符串，还得经过编码转换。这里先提一句，下文再详细说。

### Writable Stream

对比上文的 Readable Stream ，这里能接收数据“流”入的对象，都称为 Writable Stream 。Writable Stream 对象能作为参数传递给`pipe`方法，能接收数据。你可以通过 [构造函数](http://nodejs.cn/api/stream.html#stream_implementing_a_writable_stream) 实现自己的 Writable Stream 对象，上面讲到的三个也都是继承、实现构造函数。不过一般情况下我们无需这么做，了解即可。

### 再看`pipe`

`pipe`的使用有严格要求。例如`a.pipe(b)`时，`a`必须是一个可读流，即 Readable Stream 对象（或具有相同功能的对象），而`b`必须是一个可写流，即 Writable Stream 对象（或者有相同功能的对象），否则会报错。

这里“或者有相同功能的对象”卖了个关子，见下文。

----

## 有没有中转站？

数据从来源流出来，然后直奔目的地而去，这种直来直去的模式肯定是不能满足所有应用场景的。就像上文图中，水从 source 直接流向 dest 其实是没有意义的，如果中间再能加一些东西（如过滤杂质、增加微量元素、高温杀菌等）那就有意义了。

### 既可读又可写

上文提到，Readable Stream 对象是可读流，数据能从其中“流”出，Writable Stream 对象是可写流，数据能“流”向其中。其实，还有一种类型的流，具备两者的功能 —— Duplex Stream ，双工流，既可读又可写。这样说来，Duplex Stream 对象既可以有`pipe`接口，又可以作为`pipe`方法的参数。即：

```js
// 其中 b c d 是 Duplex Stream 对象，双工流
process.stdin.pipe(b)
b.pipe(c)
c.pipe(d)
d.pipe(process.stdout)

// 也可以写成
process.stdin.pipe(b).pipe(c).pipe(d).pipe(process.stdout)
```

如上代码，这样`b` `c` `d`其实就是一个一个的“中转站”、“过滤器”，这样数据就真的“流”起来了，像水一样。

### Duplex Stream

Duplex Stream 在实际应用不多，被举例最多的就是`gzip`压缩的功能，即读取一个文件，然后压缩保存为另一个文件。其中的`zlib.createGzip()`返回的就是一个 Duplex Stream 对象。

```js
var fs = require('fs')
var zlib = require('zlib')
var readStream = fs.createReadStream('./file1.txt')
var writeStream = fs.createWriteStream('./file1.txt.gz')
readStream.pipe(zlib.createGzip())
          .pipe(writeStream)
```

同理，你可以根据 [构造函数](http://nodejs.cn/api/stream.html#stream_an_example_duplex_stream) 实现自己的 Duplex Stream 对象，不再赘述。

最后，简单实现一个能在线压缩、下载的 web server

```js
var http = require('http')
var fs = require('fs')
var zlib = require('zlib')
function serverCallback(req, res) {
    var readStream = fs.createReadStream('./file1.txt')
    res.writeHead(200, {'Content-type': 'application/x-gzip'})  // 注意这里返回的 MIME 类型
    readStream.pipe(zlib.createGzip())  // 一行代码搞定压缩功能
              .pipe(res)
}
http.createServer(serverCallback).listen(8080)
```

> 其实还有一种类型的流 —— Transform Stream 。不常用，这里就不写了，有兴趣的自己去查资料吧。

----

## 是什么在流动

上文一直说数据在流动，从哪里来，到哪里去，中间经历了什么，就是没有说这个在流动的数据，到底是什么，即代码中的`chunk`是什么？

```js
req.on('data', function (chunk) {
    // “一点一点”接收内容
    data += chunk.toString()
})
```

运行代码，打印`chunk`得到的结果是`<Buffer 61 61 61 0a 62 62 62 0 ... >`，看前面`<Buffer`就知道，它是 Buffer 类型的数据。打印`chunk instanceof Buffer`即可得到`true`。

### Buffer 是什么

Buffer 对象就是二进制在 JS 中的表述形式，即 Buffer 对象就是二进制类型的数据。上文`<Buffer 61 61 61 0a 62 62 62 0 ... >`看起来像是数组的形式，但是它却不是数组，因为它的每个元素只能是一个 16 进制的两位数（换算成 10 进制即 0-255 之间的数字），就是一个字节。

> 有人可能会疑问：不是说“二进制”吗，这里怎么又成了 16 进制了？—— 因为 16 进制可以更加轻松的转换为 2 进制，而且二位数的 16 进制正好能表述为一个字节，因此就用了。

### Buffer 和字符串的关系

Buffer 是二级制，和字符串完全是两码事儿，但是他们可以相互转换 —— 前提是规定好用哪个编码规范。

```js
var str = '深入浅出nodejs'
var buf = new Buffer(str, 'utf-8')
console.log(buf)  // <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 6a 73>
console.log(buf.toString('utf-8'))  // 深入浅出nodejs
```

以上代码使用`utf-8`编码对二进制和字符串进行了转换，不过其实 JS 默认就是`utf-8`编码。

### 为何流动的数据是 Buffer 类型？

计算机真正能识别的就是二进制数据。我们在程序中使用字符串、数字、数组等都是有特定的语言和环境的，是一个封闭的开发环境。代码真正执行的时候还需要这个环境做很多其他底层的工作，并不是说计算机底层就认识字符串、数字和数组。

但是“流”动的数据却可能会跑出这个环境，它会涉及到网络 IO 和文件 IO 等其他环境。即，程序从 http 请求读取数据、或者发送数据给 http 请求，得用一个两者都认识的格式才行，那就只能是二进制了。

另外，反过来思考，不用二进制用什么呢？用字符串？那流动的数据还可能是视频和图片呢，字符串表述不了。

### Buffer 的好处

Buffer 能提高 http 请求的性能，《深入浅出 nodejs》书中提到，使用`stream.pipe(res)`在特定情况下，QPS 能从 2k+ 提升到 4k+

```js
// 不使用 Stream
res.write('hello nodejs')
res.end()

// 使用 Stream
var readStream = fs.createReadStream('./file1.txt')
readStream.pipe(res)
```

----

## 总结

其实洋洋洒洒这么多，主要就是解决开头提到的“一点一点”的从 req 中接收传递来的数据，从而引申出 Stream 这个概念，并且介绍了 Stream 中比较重要的内容。以后只要遇到`data` `end`事件，或者遇到大数据内容处理，或者遇到 IO 的性能问题等，都可以考虑到 Stream 。Stream 是 server 端比较重要的概念，其基础知识必须全面了解。

**【扩展】**

其实用 Stream 读取文件内容，无法确保是一行一行读取的，但是 nodejs 有 [readline](http://nodejs.cn/api/readline.html) 可以让你轻松实现一行一行读取文件。
