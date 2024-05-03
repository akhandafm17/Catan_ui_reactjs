import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
import ViteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        react(),
        ViteTsconfigPaths(),
    ],
    resolve: {
        alias: {
            '@': '/src',
            '@assets': 'src/assets',
            '@core': 'src/core',
            '@library': 'src/library',
            '@pages': 'src/pages',
            '@styles': 'src/styles'
        },
    },
    base: './',
    publicDir: 'public',
})
