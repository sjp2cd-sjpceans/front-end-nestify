import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default function (
  { mode }: ConfigEnv          
): UserConfig {               

  const env: Record<string, string> = loadEnv(mode, process.cwd(), 'VITE_')

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@nestify': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: Number(env.VITE_DEV_PORT) || 3000,
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT) || 4173,
    },
  })
}
