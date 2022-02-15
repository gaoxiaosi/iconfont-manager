# 介绍
iconfont-manger是一个可以管理所有iconfont图标库更新的工具。

## 温馨提醒
毕竟是爬虫，而iconfont网站页面结构可能会有变化，如果出现无法使用的情况，请及时更新或者到GitHub提交issue，我都会尽快解决！

## 安装
`npm i iconfont-manager -g`

## 功能

### 1. 初始化项目
输入`iconfont官网`的手机号（若是GitHub账号，绑定手机号即可）与密码，自动执行爬虫脚本，将账号下的所有iconfont图标库的信息爬取并存储在用户目录的`.iconfontrc`文件（重要，可自行新建），然后修改`.iconfontrc`文件的`filePath`属性，设置各个图标库对应的保存地址，也可通过功能5图形化界面管理进行设置。
``` js
iconfont-manager init <phoneNumber> <password>
```
![](https://pic-host.oss-cn-shenzhen.aliyuncs.com/img/step1-1.png)
``` json
{
  "projects": [
    {
      "id": "2936807",
      "name": "仓库系统",
      "user": "18812345678",
      "password": "abc123",
      "filePath": "/Users/wupeng/project/warehouse/src/assets"
    },
    {
      "id": "2291089",
      "name": "门户网站",
      "user": "18812345678",
      "password": "abc123",
      "filePath": "初始化后，这个字段是空的，需要手动设置图标保存的绝对路径"
    }
  ]
}
```

### 2. 查看所有图标库
读取用户目录下的`.iconfontrc`文件，将所有的iconfont图标库信息通过列表的形式展现。
``` js
iconfont-manager ls
```
![](https://pic-host.oss-cn-shenzhen.aliyuncs.com/img/step2-2.png)

### 3. 更新单个图标库
``` js
iconfont-manager update <projectId>
```
![](https://pic-host.oss-cn-shenzhen.aliyuncs.com/img/step3-3.png)

### 4. 更新多个图标库
``` js
iconfont-manager update <projectId...>
```
![](https://pic-host.oss-cn-shenzhen.aliyuncs.com/img/step4-4.png)

### 5. 图形化界面管理
``` js
iconfont-manager ui
```
![](https://pic-host.oss-cn-shenzhen.aliyuncs.com/img/step5-5.png)
### 6. 更新临时项目
更新`.iconfontrc`文件中没有的图标库
``` js
iconfont-manager updateOne <id> <name> <user> <password> <filePath>
```
### 7. 新增项目
项目信息会写入`.iconfontrc`文件中，同时最后一个参数可以选择是否立即更新图标库
``` js
iconfont-manager add <id> <name> <user> <password> <filePath> [immediately]
```

## 补充说明
支持多用户，可以修改`.iconfontrc`文件配置即可，如下图例子两个用户手机号不同
``` json
{
  "projects": [
    {
      "id": "2936807",
      "name": "仓库系统",
      "user": "18812345678",
      "password": "abc123",
      "filePath": "/Users/wupeng/project/warehouse/src/assets"
    },
    {
      "id": "2291089",
      "name": "另一个用户",
      "user": "18866668888",
      "password": "abc456",
      "filePath": "/Users/wupeng/project/official-website/src/assets"
    }
  ]
}
```

如果您觉得项目有趣或对您有所帮助，可以点右上角 **"Star"** 支持一下 谢谢！ ^_^