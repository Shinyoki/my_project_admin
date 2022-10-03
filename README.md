# 个人项目后台模板

# 项目介绍

<p align="center">我个人使用的后台模板项目，用户鉴权、菜单等基本功能配置已实现，后续会根据自己的需求进行维护更新。</p>

<p align="center">
	<a target="_blank" href="https://github.com/Shinyoki/my_project_back">
      <img src="https://img.shields.io/badge/license-MIT-green"/>
      <img src="https://img.shields.io/badge/vue-2.6.14-green"/>
      <img src="https://img.shields.io/badge/vuex-3.6.2-green"/>
      <img src="https://img.shields.io/badge/vue--router-3.5.1-green"/>
      <img src="https://img.shields.io/badge/element--ui-2.15.9-green"/>
      <img src="https://img.shields.io/badge/axios-0.27.2-green"/>
    </a>
</p>

<p align="center">
    <a href="#所有项目">所有项目</a>
    <a href="#项目特点">项目特点</a>
    <a href="技术介绍">技术介绍</a>
    <a href="项目截图">项目截图</a>
    <a href="项目总结">项目总结</a>
    <a href="项目结构">项目结构</a>
</p>

# 所有项目

**后端Github地址：**[https://github.com/Shinyoki/my_project_back](https://github.com/Shinyoki/my_project_back)

**后台Github地址：**[/Shinyoki/my_project_admin](https://github.com/Shinyoki/my_project_admin)



**后端接口文档地址：**[https://localhost:8888/doc.html](https://localhost:8888/doc.html)

默认管理员账号：`admin`，密码：`1234567`

# 项目特点

TODO ....

# 技术介绍

**后台：** 

- vue
- vuex
- vue-router
- axios
- element

**后端：**

- Spring boot
- Spring Security
- Swagger
- Mybatis Plus
- Redis
- MySql

**开发环境：**

| 开发工具                      | 说明              |
| ----------------------------- | ----------------- |
| IDEA                          | Java开发工具      |
| WebStorm                      | 前端开发工具      |
| Another Redis Desktop Manager | Redis远程链接工具 |

| 开发环境 | 版本   |
| -------- | ------ |
| JDK      | 1.8    |
| MySql    | 8.0.28 |
| Redis    | 7.0.0  |

# 项目截图

## 后台

- 登录

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163326.png)

- 首页

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163421.png)

- 用户管理

![image-20221003163454567](C:\Users\16418\AppData\Roaming\Typora\typora-user-images\image-20221003163454567.png)

![image-20221003163624830](C:\Users\16418\AppData\Roaming\Typora\typora-user-images\image-20221003163624830.png)

- 角色管理

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163509.png)

- 菜单管理

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163527.png)

- 日志管理

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163554.png)

- 接口权限管理

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163655.png)

- 个人中心

![](https://gcore.jsdelivr.net/gh/Shinyoki/images_repository/blog_images/20221003163712.png)

## 前台

TODO ...
# 项目结构

├─package.json	依赖		
├─vue.config.js	 vue配置
├─src
|  ├─App.vue		主app
|  ├─main.js		 全局配置
|  ├─views			视图
|  ├─store						vuex
|  |   ├─getters.js			
|  |   ├─index.js
|  |   ├─modules
|  ├─router					vue-router
|  |   └index.js
|  ├─layout					页面框架
|  ├─components		组件
|  ├─assets
|  |   ├─js
|  |   | ├─myConfig.js				自定义配置
|  |   | ├─utils
|  |   | |   ├─axios-api.js			自定义axios请求封装	
|  |   | |   ├─menus.js				菜单工具
|  |   | |   └token-util.js			 cookie token工具
|  |   | ├─constants
|  |   | |     └icon_names.js		自定义常量
|  |   ├─css
|  |   |  ├─global.css				 全局css
|  |   |  ├─iconfont					阿里iconfont图标库
├─public
|   ├─favicon.ico
|   └index.html
