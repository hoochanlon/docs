---
title: Astro-Paper 写作脚本
---

## 创建写作文章文件

效果：创建 `_/{year}/{month}/{year}{month}{Day}{HHSS}.md`，以及生成一下内容 

```
---
title: 'YOUR TITLE'
tags: []
slug: '20251126120915'
featured: true
pubDatetime: 2025-11-26T04:09:15.000Z
description: '本文没有特定描述，建议读者根据内容自行总结。'
---
```

实现：创建 create.py 复制以下内容

```py
import os
from datetime import datetime
import sys
import pytz

# 获取命令行参数，默认值为 'undefined'
file_name = sys.argv[1] if len(sys.argv) > 1 else 'undefined'

# 获取当前日期和时间（带时区）
timezone = pytz.timezone('Asia/Shanghai')  # 设置时区为上海（UTC+8）
current_date = datetime.now(timezone)

# 获取年月日时分秒
year = current_date.year
month = str(current_date.month).zfill(2)  # 确保月份是两位数
day = str(current_date.day).zfill(2)    # 确保日期是两位数
hour = str(current_date.hour).zfill(2)  # 确保小时是两位数
minute = str(current_date.minute).zfill(2)  # 确保分钟是两位数
second = str(current_date.second).zfill(2)  # 确保秒数是两位数

# 生成唯一的 slug (yearmmddhhss)
slug = f"{year}{month}{day}{hour}{minute}{second}"
file_name_prefix = f"{year}-{month}-{day}"

# 设置文件夹路径
folder_path = os.path.join('src', 'data', 'blog', f"_{year}", f"_{year}-{month}")

# 创建文件夹（如果不存在的话）
os.makedirs(folder_path, exist_ok=True)

# 设置文件路径，包括基于时间戳生成的 slug
file_path = os.path.join(folder_path, f"{file_name_prefix}-{file_name}.md")

# 设置 pubDatetime 格式，带时区
pub_datetime_str = current_date.strftime(f"{year}-{month}-{day} {hour}:{minute}:{second}+08:00")

# 创建文章内容
content = f"""---
title: "{file_name}"
pubDatetime: {pub_datetime_str}
description: ""  
tags: []  
slug: "{slug}"  
---

这里是文章内容...
"""

# 写入文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Post created at {file_path}")


```

## hexo 迁移到 astro 批量修改 front-matter

效果：

* 转换发布日期格式
* 将日期转为slug
* 没有描述的文件添加 description

实现：创建 front.py 文件

```py
import os
import frontmatter
from datetime import datetime

# 更新 heroImage 字段的链接
def update_hero_image_url(hero_image_url):
    if 'hoochanlon.github.io' in hero_image_url:
        return hero_image_url.replace('https://hoochanlon.github.io', 'https://cdn.jsdelivr.net/gh/hoochanlon')
    return hero_image_url

# 更新 front-matter
def update_front_matter(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 解析 front-matter
    post = frontmatter.loads(content)

    # 获取原始日期，转换成你需要的 slug 格式
    if 'date' in post:
        # 确保 post['date'] 是 datetime 对象
        if isinstance(post['date'], str):
            try:
                post['date'] = datetime.strptime(post['date'], '%Y-%m-%d %H:%M:%S')  # 如果是字符串，转换为 datetime
            except ValueError:
                post['date'] = datetime.now()  # 如果格式不对，则默认使用当前时间

        # 直接从 post['date'] 生成 slug，不做过多的格式化
        slug = post['date'].strftime('%Y%m%d%H%M%S')  # 按照年月日时分秒格式化
        publish_date = post['date'].strftime('%Y-%m-%d')  # 保留原日期格式
    else:
        # 如果没有原始日期，使用当前日期生成 slug
        slug = datetime.now().strftime('%Y%m%d%H%M%S')
        publish_date = post.get('publishDate', datetime.now().strftime('%Y-%m-%d'))  # 保持原 publishDate 或默认值

    # 获取 description，确保它是一个字符串，并去掉空格
    description = post.get('description', '')
    description = description.strip() if description else ''  # 清理 description

    # 如果 description 为空，强制写入 "" 确保字段存在
    if description == '':
        description = '"本文没有特定描述，建议读者根据内容自行总结。"'

    # 获取 tags，确保它是一个列表
    tags = post.get('tags', [])
    if not isinstance(tags, list):
        tags = []  # 确保 tags 是一个列表

    # 处理 heroImage 字段
    cover = post.get('cover', '')
    hero_image = {}
    if cover:
        hero_image['src'] = update_hero_image_url(cover)
        # hero_image['inferSize'] = True
        hero_image['width'] = 1200
        hero_image['height'] = 630
    else:
        hero_image = None  # 如果没有 cover，则移除 heroImage 字段

    # 创建新的 front-matter 数据
    new_front_matter = {
        'title': post.get('title', 'Untitled'),
        'categories': post.get('categories', ''),
        'tags': tags,
        'pubDatetime': publish_date,  # 保持原日期或使用默认日期
        'slug': f'"{slug}"',
        'description': description,  # 确保 description 为有效字符串
    }

    # 仅在有 heroImage 时才加入 heroImage 字段
    if hero_image:
        new_front_matter['heroImage'] = hero_image

    # 格式化成新的 front-matter
    new_front_matter_str = '---\n' + '\n'.join([f"{key}: {value}" for key, value in new_front_matter.items()]) + '\n---\n'

    # 更新文件内容，保留原文章内容，替换 front-matter
    new_content = new_front_matter_str + content.split('---\n')[2]

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)
    print(f"Updated: {file_path}")

# 遍历文件夹中的所有文件
def process_folder(root_folder):
    for subdir, dirs, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(subdir, file)
                update_front_matter(file_path)

# 执行转换
process_folder('C:/Users/hooch/Pictures/_posts')
```

## GitHub源链接图片更换成CDN链接

创建 re-gh-imgs-url.py 文件

```py
import os
import re

# 定义文件夹路径
folder_path = r'C:\Users\hooch\Documents\GitHub\hoochanlon.github.io\src\data\blog'  # 修改为你的文件夹路径
print(f"Opening folder: {folder_path}")

# 定义 GitHub 图片链接的正则表达式，匹配 GitHub 图片链接和普通链接
github_image_pattern = r'!\[.*?\]\(https://hoochanlon.github.io/picx-images-hosting[^\s\)]+|https://hoochanlon.github.io/picx-images-hosting[^\s\)]+'

# 定义 CDN 的基础 URL
cdn_base_url = 'https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/'

# 遍历文件夹中的所有 Markdown 文件
for root, dirs, files in os.walk(folder_path):
    for file in files:
        if file.endswith('.md'):  # 只处理 Markdown 文件
            file_path = os.path.join(root, file)
            print(f"Processing file: {file_path}")

            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 查找所有 GitHub 图片链接并替换为 CDN 链接
            def replace_github_image_url(match):
                original_url = match.group(0)
                print(f"Found URL: {original_url}")  # 打印找到的 GitHub 图片链接

                # 提取 URL 部分，去掉 ![]() 语法中的其他部分
                try:
                    url = re.search(r'https://hoochanlon.github.io/picx-images-hosting[^\s\)]+', original_url).group(0)
                    print(f"Extracted URL: {url}")  # 打印提取的 URL

                    # 构建 CDN URL
                    cdn_url = cdn_base_url + url.split('hoochanlon.github.io/picx-images-hosting/')[1]
                    return original_url.replace(url, cdn_url)
                except Exception as e:
                    print(f"Error while processing URL: {original_url}, {e}")
                    return original_url  # 如果出错，保持原 URL

            # 替换链接
            updated_content = re.sub(github_image_pattern, replace_github_image_url, content)

            # 如果文件内容有变化，保存更新后的内容
            if updated_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Updated: {file_path}")
            else:
                print(f"No changes for: {file_path}")

```