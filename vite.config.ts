import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This tells Vite to look for assets in your repository sub-folder
  base: '/Myprojects/',
})