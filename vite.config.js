import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/exam-countdown-planner/",
    build: { sourcemap: false },
    plugins: [react()],
});
