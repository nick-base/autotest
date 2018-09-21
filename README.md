## autotest 自动化测试程序。

#### 一个简单的案例

###### 添加config文件

```json
{
    "project": "baidu",
    "driver": "chromedriver_linux64/chromedriver",
    "steps": [
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
        }
    ]
}

```

###### 生成测试
```python
 t = Test('baidu/home.json')
 t.run()
```

#### 提高可复用性

很多操作是通用的，比如登录，可以抽离出来作为一个componment。登录的时候表单填写的数据不同，所以，数据部分可以统一放在一个data文件里。

因此，调整后的config结构为
```
 -- component
 -- data
 -- script
 -- test-config.json
```
#### 实例
```JavaScript
// component/login.json
{
    "steps": [
        {
            "operation": "get",
            "#data": "login_data"
        },
        {
            "operation": "input",
            "#data": "login_data"
        },
        {
            "operation": "click",
            "target": "class#loginSubmitBtn"
        }
    ]
}

// data/test-config001.json
{
    "login_data": {
        "url": "",
        "id#username": "",
        "id#password": ""
    },
}

// test-config.json
{
    "project": "nick-test",
    "driver": "chromedriver_linux64/chromedriver",
    "screenshot": "nick-test/001",
    "data": "test-config001",
    "steps": [
        {
            "operation": "component",
            "name": "login"
        }
        // Todo
    ]
}

```
