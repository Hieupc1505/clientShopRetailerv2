import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const local = 'http://localhost:8500/';
const server = 'https://shopv2.onrender.com/';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '^/api/v2/.*': {
                target: 'https://shopv2.onrender.com',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
