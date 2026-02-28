---
slug: SMB
title: SMB 签名问题
date: 2025-08-26
authors: [guangyu]
tags: [windows]
---


###  Windows 11 24H2 中，共享文件夹出现下图报错问题
![](./error_info.jpg)

<!-- truncate -->
在 Windows 11 24H2 中，如果升级后共享文件夹出现问题，可能是由于强制启用了 SMB 签名（SMB Signing）导致的连接失败。

以下是禁用 SMB 签名的操作步骤，适用于专业版或企业版（家庭版需通过注册表调整）：
### 使用组策略编辑器（gpedit.msc，专业版/企业版）

1、打开组策略编辑器：
```
按 Win + R，输入 gpedit.msc，然后按回车。
```
2、导航到相关设置：
~~~
依次展开：计算机配置 > 管理模板 > 网络 > Lanman工作站。
~~~

3、找到 SMB 签名策略：
```
找到并双击“启用安全签名”（或“Enable secure SMB signing”）。
```

4、禁用签名：
```
将设置改为“已禁用”（Disabled）。
点击“确定”保存。
```

5、重启电脑：
```
重启共享端（IP 192.168.1.200 的电脑）以应用更改。
```

6、测试连接：
```
在访问端按 Win + R，输入 \\192.168.1.200 测试是否恢复正常。
```


### 使用注册表编辑器（家庭版或无 gpedit.msc）

1、打开注册表编辑器：
```
按 Win + R，输入 regedit，然后按回车（需要管理员权限）。
```

2、导航到相关路径：
```
找到：HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters。
```

3、修改或添加键值：
```
查找 RequireSecuritySignature：

如果存在，双击将其值改为 0（禁用）。
如果不存在，右键“Parameters” > “新建” > “DWORD (32位) 值”，命名为 RequireSecuritySignature，值设为 0。
```
```
查找 EnableSecuritySignature：

如果存在，双击将其值改为 0（可选，建议同时禁用）。
如果不存在，创建新 DWORD，命名为 EnableSecuritySignature，值设为 0。
```



4、保存并重启：
```
点击“文件” > “退出”，然后重启电脑。
```

5、测试连接：
```
同上，在访问端测试 \\192.168.1.200。
```


#### 注意事项

**安全性：** 禁用 SMB 签名会降低网络通信的安全性，仅在必要时使用，建议后续启用防火墙或使用 VPN 保护。
**验证效果：** 重启后若仍无效，检查防火墙是否阻挡了 SMB 端口（445），或确保两台电脑的 SMB 协议版本兼容。
**备份：** 操作前建议备份注册表（文件 > 导出）以防误操作。
