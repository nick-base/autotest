# zero

## setup

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

```sh
# 启动容器
COMPOSE_PROJECT_NAME=zero docker-compose up -d
```

```js
use testdb

db.createUser( { user: "root", pwd: "123456", roles: [ { role: "dbOwner", db: "testdb" } ] } )

db.auth("root", "123456")
```

## 前端

```sh
npm run dev
```
