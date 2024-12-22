import react from "@vitejs/plugin-react-swc";
import { loadEnv, UserConfig, defineConfig } from "vite";
import { checker } from "vite-plugin-checker";

const config = (({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "");
  const external = ["react", "react/jsx-runtime", "react-dom"];
  const plugins = [react(), checker({ typescript: true })];

  return {
    base: "./",
    server: {
      host: "http://127.0.0.1",
      port: env.PORT ? Number(env.PORT) : 5173,
      watch: {
        usePolling: true,
      }
    },
    build: {
      outDir: "../../../themes/droplink/account/resources",
      sourcemap: true,
      target: "esnext",
      modulePreload: false,
      cssMinify: "lightningcss",
      manifest: true,
      rollupOptions: {
        external,
      },
    },
    plugins,
  };
});

export default defineConfig(config({ mode: 'development' }));

