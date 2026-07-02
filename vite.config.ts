/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

/** Chunks de rutas lazy: no precachear — no forman parte del arranque en frío. */
const CHUNKS_LAZY_SIN_PRECACHE = [
	"**/resumen-semanal-*.js",
	"**/administrar-habitos-*.js",
	"**/ver-carpeta-*.js",
	"**/ver-escrito-*.js",
	"**/modo-lectura-*.js",
	"**/tacho-*.js",
	"**/nueva-carpeta-*.js",
	"**/nuevo-escrito-*.js",
	"**/modal-seleccionar-carpeta-*.js",
	"**/habit-tracker-*.js",
	"**/menu-habitos-*.js",
	"**/buscar-escritos-*.js",
	"**/objetivos-dia-widget-*.js",
	"**/editor-lista-objetivos-*.js",
	"**/objetivo-item-fila-*.js",
	"**/lista-*.js",
	"**/input-*.js",
	"**/textarea-*.js",
	"**/TrashIcon-*.js",
	"**/ChevronLeftIcon-*.js",
	"**/useMutation-*.js",
	"**/use-api-mutation-*.js",
	"**/utilidades-habitos-*.js",
	"**/sync-engine-*.js",
];

export default defineConfig({
	server: {
		host: true,
		proxy: {
			"/api": {
				target: "http://localhost:5072",
				changeOrigin: true,
			},
		},
	},
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "favicon-96x96.png", "apple-touch-icon.png", "logo192.png", "logo512.png"],
			manifest: false,
			workbox: {
				// Sin svg: favicon.svg suele ser enorme (PNG embebido) y no aporta al arranque.
				globPatterns: ["**/*.{js,css,html,ico,png,woff2}"],
				globIgnores: ["**/node_modules/**", ...CHUNKS_LAZY_SIN_PRECACHE],
				navigateFallback: "index.html",
				navigateFallbackDenylist: [/^\/api\//],
			},
		}),
	],
	build: {
		target: "es2017",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/setup-tests.ts"],
		include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.test.mjs"],
	},
});
