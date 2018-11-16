## autotest 自动化测试程序 version 1.0

**核心代码** `/home/nick/nick/autotest/src/core/test.py`

项目的核心思路是用selenium实现自动化的一些操作。

###### 第一阶段：

读取配置文件，执行配置文件中定义的操作，配置文件是json文件。核心部分是一个"step"为key的数组。

比如： 打开百度。
```json
{
    "operation": "get",
    "url": "https://www.baidu.com/"
}
```

可以优化成
```js
{
    "get": "https://www.baidu.com/"
}
```

#### 第二阶段:

把操作和数据分离，比如在文本框输入登录信息。
```js
{
    "input": {
        "id#username": "nick",
        "id#password": "nick"
    }
}
```
将数据放在data文件中

```js
{
    "input": "#input_data"
}
// data.json
{
    "input_data": {
        "id#username": "nick",
        "id#password": "nick"
    }
}
```

#### 第三阶段
模块分离，比如登录操作，可以作为一个组件，放在一个单独的组件文件中。调用时：
```
{
    'component': 'login'
}
```

#### 第四阶段
逐渐完善operation，支持执行js脚本，shell命令等

#### 执行

代码 `/home/nick/nick/autotest/src/run.py`

传入参数: 测试配置脚本文件，数据文件
