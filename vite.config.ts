import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { EventEmitter } from 'events';

// Increase the default max listeners to avoid MaxListenersExceededWarning
EventEmitter.defaultMaxListeners = 24;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
    },
    define: {
      // This is critical: it exposes the process.env.API_KEY to the client-side code
      // so your geminiService.ts can read it even after being built.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});