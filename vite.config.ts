import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

// ```typescript
// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//       "@components": path.resolve(__dirname, "./src/components"),
//       "@pages": path.resolve(__dirname, "./src/pages"),
//       "@hooks": path.resolve(__dirname, "./src/hooks"),
//       "@utils": path.resolve(__dirname, "./src/utils"),
//       "@types": path.resolve(__dirname, "./src/types"),
//       "@api": path.resolve(__dirname, "./src/api"),
//       "@store": path.resolve(__dirname, "./src/store"),
//       "@assets": path.resolve(__dirname, "./src/assets"),
//     },
//   },
//   server: {
//     port: 3000,
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000", // Django backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })
// ```