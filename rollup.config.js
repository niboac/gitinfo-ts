import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from '@rollup/plugin-typescript';

export default {
  input: "src/index.ts", // 入口文件
  output: {
    file: "dist/index.js", // 输出文件
    format: "cjs", // 输出格式为 CommonJS
  },
  plugins: [
    typescript(), // 编译 TypeScript
    resolve(), // 解析 Node.js 模块
    commonjs(), // 加载 CommonJS 模块
  ],
  external: ["child_process"], // 排除 Node.js 内置模块
}
