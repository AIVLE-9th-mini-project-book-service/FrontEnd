import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/members': 'http://localhost:8080',
            '/books': 'http://localhost:8080',
            '/comments': 'http://localhost:8080',
        }
    }
})