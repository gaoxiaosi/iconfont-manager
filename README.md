# 介绍
iconfont-manger是一个可以管理所有iconfont图标库更新的工具。

## 安装
建议全局安装`npm i iconfont-manager -g`

## 功能

### 1. 初始化项目
输入`iconfont官网`的手机号（账号，若之前是GitHub账号，绑定手机号即可）与密码，自动执行爬虫脚本，将该账号下的所有iconfont图标库的信息爬取到用户目录下的`.iconfontrc`文件（特别重要，可自行新建，后面大多功能都要读取这个文件）。注意：该命令只是将项目信息爬取下来，还需要修改`.iconfontrc`文件的`filePath`属性，将各个图标库对应的保存地址设置好才可使用，也可通过功能5图形化界面管理进行设置。
``` js
iconfont-manager init <phoneNumber> <password>
```
效果如下：

### 2. 查看所有图标库
读取用户目录下的`.iconfontrc`文件，将所有的iconfont图标库信息通过列表的形式展现。
``` js
iconfont-manager ls
```
效果如下：

### 3. 更新单个图标库
`.iconfontrc`文件中已存在的projectId。
``` js
iconfont-manager update <projectId>
```
效果如下：

### 4. 更新多个图标库
`.iconfontrc`文件中已存在的projectId，多个projectId空格隔开。
``` js
iconfont-manager update <projectId...>
```
效果如下：

### 5. 图形化界面管理
使用`.iconfontrc`文件作为配置文件，在浏览器中进行操作
``` js
iconfont-manager ui
```
效果如下：
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

如果您觉得项目有趣或对您有所帮助，可以点右上角 **"Star"** 支持一下 谢谢！ ^_^