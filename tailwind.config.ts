// tailwind.config.ts
// NOTE: Tailwind v4 不读取此文件，此文件仅作配置参考。
// 实际颜色/主题配置在 app/globals.css 的 @theme inline { } 块中维护。
// 如需添加/修改颜色，请直接编辑 app/globals.css。
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 以下颜色已在 app/globals.css @theme inline 中定义为 CSS 变量
        // 修改颜色请去 globals.css，不要修改这里
        primary: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
        },
        brand: {
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
