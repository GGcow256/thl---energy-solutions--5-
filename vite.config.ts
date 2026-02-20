import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 部署在子路径 /liu/ 下
  base: '/liu/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    // 这里设置 open 为字符串 '/liu/'，
    // 这样运行 npm run dev 时会自动打开 http://localhost:3000/liu/
    open: '/liu/' 
  }
});