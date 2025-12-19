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
      },
    },
    ssr: {
      noExternal: ['@astrojs/starlight'],
    },
  },
    integrations: [expressiveCode(), starlight({
        plugins: [
          starlightImageZoom(),
          starlightThemeFlexoki(),
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
                label: '常用的命令备忘',
                items: [
                    { label: 'git 常用命令', slug: 'cmd/git-cmd' },                    
                ],
            },
            {
                label: '便利工具收集',
                items: [
                    { label: '像只仓鼠囤积我的数字工具', slug: 'tools/hamster' },                    
                ],
            },
            {
                label: 'Astro-Starlight',
                items: [
                    { label: 'Astro-Starlight 简要配置', slug: 'astro-starlight/astro-starlight-example' },
                    { label: 'Astro-Starlight 扩展', slug: 'astro-starlight/starlight-writing-extensions'},
                    { label: 'Astro-Starlight 写作脚本', slug: 'astro-starlight/astro-starlight-scripts' },
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
                label: 'fumadocs',
                items: [
                    { label: 'fumadocs 简要配置', slug: 'fumadocs/fumadocs-example' },
                ],
            },
        ],
        }), markdoc()],
});


