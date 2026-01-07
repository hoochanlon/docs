# Front-matter 加密功能使用说明

## 功能说明

现在你可以在 MDX 文件的 front-matter 中添加 `password` 字段来自动加密页面内容。当用户访问页面时，需要输入正确的密码才能查看内容。

## 使用方法

### 1. 在 front-matter 中添加密码字段

在需要加密的 MDX 文件的 front-matter 中添加 `password` 字段：

```mdx
---
title: 加密文章示例
password: "your-password-here"
passwordSubtitle: "请输入密码以查看内容"  # 可选
---

这里是需要加密的内容。
```

### 2. 使用 EncryptedContent 组件（推荐）

在 MDX 文件中，使用 `EncryptedContent` 组件来包装需要加密的内容：

```mdx
---
title: 加密文章示例
password: "your-password-here"
passwordSubtitle: "请输入密码以查看内容"  # 可选
---

import { getEntry } from 'astro:content';
import EncryptedContent from '@components/EncryptedContent.astro';

const entry = await getEntry('docs', 'your-page-slug');

<EncryptedContent entry={entry}>
  # 这里是需要加密的内容

  这些内容只有在输入正确密码后才能查看。
</EncryptedContent>
```

### 3. 直接使用 PasswordWrapper 组件

你也可以直接在 MDX 文件中使用 `PasswordWrapper` 组件：

```mdx
---
title: 加密文章示例
---

import PasswordWrapper from '@components/PasswordWrapper.astro';

<PasswordWrapper password="your-password-here" passwordSubtitle="请输入密码以查看内容">
  # 这里是需要加密的内容

  这些内容只有在输入正确密码后才能查看。
</PasswordWrapper>
```

## 功能特性

- ✅ 支持在 front-matter 中定义密码
- ✅ 客户端加密/解密（使用 AES-CBC 算法）
- ✅ 密码输入框支持显示/隐藏切换
- ✅ 支持回车键快速提交
- ✅ 自动保存密码到 localStorage（24小时有效期）
- ✅ 密码错误提示
- ✅ 响应式设计，适配移动端

## 注意事项

1. 密码存储在 front-matter 中，是明文的。如果需要更高的安全性，建议使用服务器端加密。
2. 加密是在客户端进行的，有经验的用户仍然可以通过查看源代码或控制台获取加密内容。
3. 这种方法适用于对安全性要求不高的场景，主要用于防止非技术用户直接查看内容。

## 文件结构

- `src/utils/encrypt.ts` - 加密工具函数
- `src/components/Encrypt.astro` - 加密组件（核心加密逻辑）
- `src/components/PasswordWrapper.astro` - 密码包装组件
- `src/components/EncryptedContent.astro` - 从 front-matter 读取密码的组件
- `src/styles/password.css` - 密码相关样式
- `src/content.config.ts` - 扩展了 schema 以支持 password 字段

