// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import expressiveCode from 'astro-expressive-code';
import rehypeExternalLinks from "rehype-external-links";
import markdoc from '@astrojs/markdoc';
import starlightImageZoom from 'starlight-image-zoom';
import starlightThemeGalaxy from 'starlight-theme-galaxy';
import starlightThemeRapide from 'starlight-theme-rapide';
import starlightThemeFlexoki from 'starlight-theme-flexoki';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
   site: 'https://hoochanlon.github.io',
   base: 'docs',
    markdown: {
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: "\_blank",
            rel: ["noopener", "noreferrer", "external"],
          },
      ],
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    ssr: {
      noExternal: ['@astrojs/starlight'],
    },
  },
    integrations: [
      mermaid({
        theme: 'forest',
        autoTheme: true
      }),
      expressiveCode(), starlight({
        plugins: [
          starlightImageZoom(),
          // starlightThemeFlexoki(),
          starlightThemeRapide(),
          // starlightThemeGalaxy(),
        ],
        title: 'My Docs',
        customCss: [
          // 你的自定义 CSS 文件的相对路径
          './src/styles/custom.css',
        ],
        locales: {
          root: {
            label: '简体中文',
            lang: 'zh-CN',
          },
      },
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/hoochanlon' }],
        editLink: {
            baseUrl: 'https://github.com/hoochanlon/docs/edit/master',
        },
        sidebar: [
            {
                label: '欢迎',
                items: [
                    { label: '内容主页', slug: 'welcome' },
                ],
            },
            {
                label: '文本及用语规范',
                items: [
                    { label: '电子书层级内容用语约定', slug: 'writing-standards/ebook-content-guidelines' },
                    { label: '盘白清晰表达方式约定', slug: 'writing-standards/content-emphasis-guidelines' },
                    
                ],
            },
            {
                label: '现代软件开发实践杂谈',
                items: [
                    { label: '从脚本到产品：我的跨平台开发之旅', slug: 'dev-talk/script-to-app' },
                    { label: '软件推广三维对比：技术圈、核心区与流量海', slug: 'dev-talk/cross-platform-promotion-analysis' },
                ],
            },
            {
                label: '常用的命令备忘',
                items: [
                    { label: 'git 常用命令', slug: 'cmd/git-cmd' },    
                      { label: '项目常用命令', slug: 'cmd/project-cmd' },                    
                ],
            },
            {
                label: '非蠢既坏的 MacOS',
                items: [
                    { label: '面向开放 MacOS 的一小步', slug: 'awful-mac/mac-cmd' },                        
                ],
            },
            {
                label: '便利工具收集',
                items: [
                    { label: '像只仓鼠囤积我的数字工具', slug: 'tools/hamster' },                    
                ],
            },
            {
                label: 'Mermaid 原理图',
                items: [
                    { label: '项目应用技术原理图 （一）', slug: 'mermaid/mermaid-myproject-1' },                    
                ],
            },
            {
                label: 'Astro-Starlight',
                items: [
                    { label: 'Astro-Starlight 简要配置', slug: 'astro-starlight/astro-starlight-example' },
                    { label: 'Astro-Starlight 扩展', slug: 'astro-starlight/starlight-writing-extensions'},
                    { label: 'Astro-Starlight 写作脚本', slug: 'astro-starlight/astro-starlight-scripts' },
                    { label: 'Astro-Starlight 加密内容示例', slug: 'astro-starlight/astro-starlight-encrypted' },
                ],
            },
            {
                label: 'Astro-Paper',
                items: [
                    { label: 'Astro-Paper 简要配置', slug: 'astro-paper/astro-paper-example' },
                    { label: 'Astro-Paper 写作脚本', slug: 'astro-paper/astro-paper-scripts' },
                ],
            },
            {
                label: 'Fumadocs',
                items: [
                    { label: 'Fumadocs 简要配置', slug: 'fumadocs/fumadocs-example' },
                ],
            },
        ],
        }), markdoc()],
});


