Unicorn NFT
===============
## 介绍

本项目是 Unicorn NFT 的前端项目，受[国产良心](https://github.com/GuoChanLiangXin/gclx-official)项目的启发，以学习为目的而创建，部分代码参考自国产良心项目，在此基础上进行了扩展。

本项目合约代码在 [unicorn-contract](https://github.com/zhima/unicorn-contract)。

本项目已部署上线，点此[查看](https://unicorn-nft-next.vercel.app/)。

## 安装运行

首先要把 .env.example 文件重命名为 .env.local，然后在该文件中填入需要的环境变量，Next.js 框架运行时会自动读取该文件的环境变量。

依次运行以下命令

```bash
pnpm install
pnpm dev
```

用浏览器打开 [http://localhost:3000](http://localhost:3000) 就能看到本项目的页面了。

## 发布部署

本项目是基于 Next.js 框架开发的，而且用到了该框架的 [API routes](https://nextjs.org/docs/api-routes/introduction) 特性，所以最适合的部署方式是使用创建 Next.js 框架的前端部署服务 [Vercel](https://vercel.com/) - 前期免费 100GB 流量，付费版 20 USD 1T 流量，自带 CDN 全球都很快，提供免费子域名。支持 Next.js 自动集成部署，只要导入你的 github 仓库，每次推送修改到 github 都会自动重新部署。

注意在 Vercel 创建项目时需要在 Environment Variable 中添加 .env.local 的环境变量。

## 技术和组件

- [Next.js](https://nextjs.org/) - 开源的 React 开发框架，包括约定式路由、API Routes、SSR/SSG等特性。
- [ethers.js](https://github.com/ethers-io/ethers.js/) - 用于连接 ethereum 节点的开源库，是跟区块链交互的入口。
- [web3modal](https://github.com/Web3Modal/web3modal) - 用于连接钱包的开源 React 组件。
- [MUI](https://mui.com/) - 基于 Material Design 的 React 开源组件库。
- [tailwindcss](https://tailwindcss.com/) - 流行的 css 原子样式库。
- [styled-components](https://emotion.sh/docs/styled) - 创建自定义样式组件的开源库。
- [Dva](https://dvajs.com/guide/getting-started.html) - 集成了 redux 和 redux-saga 的状态管理工具。

## 白名单（Whiltelist）功能说明

本项目通过 Merkle Tree 实现白名单功能，当合约处于预售状态时，会通过 api 接口获取当前连接的钱包地址的 Merkle Proof，然后调用合约的预售接口进行验证和 mint。