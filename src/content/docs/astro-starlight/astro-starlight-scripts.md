---
title: "Astro-Strlight 写作脚本"
slug: "20251202175510"
---

## 文件定位

创建生成唯一标识符的写作文件 create_doc.py

```
# create_doc.py
import os
import sys
from datetime import datetime
import pytz

# 目标目录（Astro 默认的 content/docs）
CONTENT_DIR = "src/content/docs"

# 确保目录存在
os.makedirs(CONTENT_DIR, exist_ok=True)

# 获取命令行参数：文章标题（支持空格，用引号包起来运行）
if len(sys.argv) < 2:
    print("用法: python create_doc.py \"你的文章标题\"")
    sys.exit(1)

title = " ".join(sys.argv[1:]).strip()
if not title:
    title = "untitled"

# 中国时区时间
tz = pytz.timezone('Asia/Shanghai')
now = datetime.now(tz)

# 生成时间戳部分
timestamp = now.strftime("%Y-%m-%d-%H%M")   # 2025-12-02-1423
slug = now.strftime("%Y%m%d%H%M%S")          # 20251202142305（可用于 slug）

# 文件名：日期-时间戳-标题.md
# 把标题里的非法字符简单替换一下，防止文件名出错
safe_title = "".join(c if c.isalnum() or c in "-_" else "-" for c in title)
filename = f"{timestamp}-{safe_title}.md"
filepath = os.path.join(CONTENT_DIR, filename)

# pubDatetime 使用 ISO 8601 带时区（Astro 推荐格式）
pub_datetime = now.strftime("%Y-%m-%dT%H:%M:%S+08:00")

# 最简 frontmatter（只保留标题，其他可自行后期补全）
content = f"""---
title: "{title}"
slug: "{slug}"
---

这里是正文内容...

"""

# 写入文件
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content.strip() + "\n")

print(f"文章已创建：{filepath}")
```

配置如下：


```mjs title="\apparent-apogee\astro.config.mjs" heightlight {7}
			sidebar: [
				{
					label: 'Astro-Strlight',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Astro-Strlight 简要配置', slug: 'astro-starlight/astro-starlight-example' },
						{ label: 'Astro-Strlight 写作脚本', slug: '20251202175510' },
					],
				},
				{
					label: 'Astro-Paper',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Astro-Paper 简要配置', slug: 'astro-paper/astro-paper-example' },
						{ label: 'Astro-Paper 写作脚本', slug: 'astro-paper/astro-paper-scripts' },
					],
				},
			],
```

效果：以日期作为固定URL，文件不受文件夹移动所影响。