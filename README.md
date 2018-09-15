#### autotest 自动化测试程序。

#### 如何添加一个测试

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

