# Changelog

## [0.0.1] - 2023-08-16

### Added

- 添加 Footer 组件
- 添加 LinkText 组件
- 添加问题详情页
- 添加问题答题区域
- 添加 request 函数
- 添加 Avatar 组件
- 添加 Button 组件
- 添加 Badge 组件
- 添加 ErrorText 组件
- 添加 Table 组件
- 添加 Toast 组件
- 添加 useLogin
- 添加 useToast
- 添加登录页
- 添加验证码登录
- 添加账号密码登录
- 未注册用户登录时自动注册
- 添加登出
- 添加路由 Token 认证
- 添加自动刷新 Token 逻辑
- 新增全局 toast 方法
- request 方法添加 401 全局处理

### Changed

- 将 Nav 组件设置为 sticky 布局
- 统一网站 Link 组件为 radix-ui 的 Link 组件
- 将 Toast 组件 z-index 设置为 9
- 将所有 is 开头的 boolean 变量重命名

## [0.0.2] - 2023-08-22

### Added

- 添加发送邮件逻辑
- 添加验证码邮件模版

## [0.0.3] - 2023-08-23

### Added

- 新增使用 useInterval 实现的 useCountdown
- 新增创建问题
- 新增 FormItem 组件
- 新增 create_migrate.sh 和 migrate.sh
- 添加全局 loading

### Changed

- 修改 useCountdown 为 useCountdownRaf
- 移除 Table 组件的 loading 属性，改为使用全局 loading

## [0.0.4] - 2023-08-23

### Added

- 新增 BadgeGroup 组件
- 创建问题时增加分类选项
- 创建问题时增加题解选项
- 新增更新问题

### Changed

- 将验证码倒计时开始时机更改为调用接口前
- 查看我的问题页面添加分类、创建时间
- 对使用 var 声明的数组类型转换为使用 := 初始化

### Removed

- 移除 uuid
- 移除 swr

## [0.0.5] - 2023-08-25

### Added

- 添加 GORM
- 添加用户解题状态

### Changed

- 将数据库部分迁移至 GORM
- 将所有 varchar 类型默认值迁移至 GORM 默认值
- GORM 日志移除查询数据为空报错
- Token 校验失败自动退出登录

## [0.0.6] - 2023-08-27

### Added

- 添加 Redis 用于管理短链接
- 新增忘记密码
- 新增重置密码
- 添加生成短链接功能

### Changed

- 修复部分 eslint warning，将 onClick、onChange 等事件的回调函数从箭头函数改为 useCallback
- 完善账号密码登录功能

### Fixed

- 修复 BadgeGroup 无法点击的问题
- 修复 UpdatedBy 为空时外键报错

## [0.0.7] - 2023-08-29

### Added

- 添加判断文件是否存在工具方法
- 添加创建目录工具方法

### Changed

- 根据 golang project layout 规范重构目录结构
- 重新设计部分表结构
- 完善答题过程

## [0.0.8] - 2023-09-07

### Changed

- 更新 Footer 样式