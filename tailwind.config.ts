import type { Config } from 'tailwindcss'

const config: Config = {
  // Đây là phần quan trọng nhất, nó bảo Tailwind hãy quét các file này
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Nơi bạn có thể mở rộng theme, ví dụ thêm màu sắc, font chữ
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [ require('tailwind-scrollbar'), ],
}
export default config