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

- linux 管道
- 模拟一下
- Stream
- Buffer
- ReadLine

-----

## linux 管道

`grep 'bbb' file1.txt`是一个基础 linux 命令，就是从`file1.txt`中查找带有`bbb`的内容，一般用于日志排查。不知道有没有查询过大文件，例如`file1.txt`有 10w 行，**执行`grep`时，查找的内容是一行一行输出的，并不是全部查询完了一次性输出**。这个现象，和上文中说的`“一点一点”接收内容`有点类似。

`ls | grep 'file1.txt'`这个命令，就是查找当前目录下有没有名为`file1.txt`的文件。通过`ls`查询出内容，然后用`|`将内容传递给下一个命令。**使用`|`可以进行链式操作，其中的每一个操作都可以看做是“过滤器”，而`|`可以看做是“管道”**。

明白了 linux 命令的这种输入输出的机制，再去学习下面的内容就简单很多了。

-----

## 模拟一下

下面我们就模拟一下`grep 'bbb' file1.txt`的功能，其中使用的一些函数和用法后面会讲到，先把程序写出来。

以我们传统的思路，nodejs 作为 server 端的语言，那肯定有读写文件的能力，直接将`file1.txt`的内容读出来，然后进行字符串处理筛选`bbb`就是了。但是，那样做不到`“一点一点”`的效果，而是整个都出来了。

```js

```

**为何要`“一点一点”`的？** 

-----

## Stream






----

## pipe


-----

## 常见的 Stream 对象


-----

## Buffer



-----

## ReadLine



-----

## 总结

整理回顾`req.on('data', ...`和`req.on('end', ...`

