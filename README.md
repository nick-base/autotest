## autotest 自动化测试程序 version stable

#### 目的

实现一些简单的浏览器页面操作，减少重复工作

#### 技术

 - Pyhton 3.5
 - Django 2.1.2
 - Selenium 3.14.0
 - Vue 3.0.5

#### 实现思路

使用python读取json配置文件，然后模拟执行浏览器操作。
核心类`core/test.py`

 - project: 项目名
 - driver_path： 驱动路径，存在项目下的drivers目录下
 - steps: 执行操作

```js
{
    "project": "baidu",
    "driver_path": "chromedriver_linux64/chromedriver",
    "driver": "chrome",
    "steps": [
        {
            "sh": "test.sh"
        },
        {
            "operation": "get",
            "url": "https://www.baidu.com"
        },
        {
            "operation": "input",
            "data": {
                "id#kw": "hello"
            }
        },
        {
            "operation": "click",
            "target": "id#su"
        },

        {
            "operation": "sleep",
            "time": 2
        },
        {
            "operation": "click",
            "target": "xpath#//h3[@class='t'][1]"
        }
    ]
}
```

###### get请求
```js
{
    "operation": "get",
    "url": "https://www.baidu.com"
}

{
    "op": "get",
    "url": "https://www.baidu.com"
}

{
    "get": "https://www.baidu.com"
}

{
    "get": "#baidu_url"
}
// baidu_url 存在数据存贮data文件中
```
###### 组件
定义

```js
{
    "steps": [
        {
            "get": "https://mail.qq.com/"
        },
        {
            "frame": "id#login_frame"
        },
        {
            "input": "#login_data"
        },
        {
            "screenshot": "1.png"
        },
        {
            "click": "id#login_button"
        }
    ]
}
```

引用
```js
{
    "operation": "component",
    "name": "login"
}

{
    "component": "login"
}

{
    "c": "login"
}
```

数据
```js
{
    "login_data": {
        "id#u": "",
        "id#p": ""
    }
}
```
