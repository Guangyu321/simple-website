---
slug: git-code-migration
title: git代码迁移
authors: [guangyu]
tags: [git]
---

### 代码迁移

一个gitlab仓库迁移到coding仓库

**1、** 新git下先创建好空项目
```
	这边新git是gitblit，直接web可视化窗口创建，创建时允许建立分支勾上、加入readme 、加入.gitignore文件不能勾上,创建后记录下新git 项目仓库地址
	https://e.coding.net/g-jfao5597/YELLOW/YELLOW_BACK.git
```
<!-- truncate -->

**2、** 克隆旧git仓库下需要迁移的项目
	临时新建一个文件夹，右键打开 git bash here 指令窗口
```
	使用 --mirror 选项会克隆所有分支、标签和远程信息
	git clone --mirror https://gitlab.com/Tech/yellow/yellow.git
```
**3、** 添加项目远程仓库为新git的项目仓库地址
	继续在上面的指令窗口执行
```
	# yellow.git对应上面的git项目名称
	cd yellow.git
	# 然后，添加新git的项目仓库地址作为新的远程目标,这里的gitblit自定义命名，下面的指令会使用到
	git remote add gitblit https://e.coding.net/g-jfao5597/YELLOW/YELLOW_BACK.git
```
**4、** 推送所有分支和标签到新git项目仓库
	使用以下命令将所有分支和标签推送到新git项目仓库,依次执行以下命令
```
	# 推送所有分支
	git push gitblit --all
	# 推送所有标签
	git push gitblit --tags
	#强制推送
	git push gitblit --all --force
```
