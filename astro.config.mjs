import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";

const codeBlockMode = process.env.YUNBO_CODE_BLOCKS === "expressive" ? "expressive" : "legacy";
const expressiveCodeIntegration = expressiveCode({
  themes: ["github-light", "github-dark"],
  themeCssSelector: (theme) => {
    if (theme.name === "github-light") return "[data-theme-mode='light']";
    if (theme.name === "github-dark") return "[data-theme-mode='dark']";
    return false;
  },
  useDarkModeMediaQuery: true,
  styleOverrides: {
    borderRadius: "8px"
  }
});

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://yunbo.example.com",
  integrations: [
    icon({
      include: {
        lucide: ["archive", "arrow-up", "chevron-down", "file-text", "folder", "house", "monitor", "moon", "rotate-ccw", "rss", "sliders-horizontal", "sun"],
        "simple-icons": ["github"]
      }
    }),
    ...(codeBlockMode === "expressive" ? [expressiveCodeIntegration] : []),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
