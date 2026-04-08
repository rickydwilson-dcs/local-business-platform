import "./lib/register-all-themes"; // MUST be first
import type { Config } from "tailwindcss";
import { createThemePlugin, getRegisteredThemes } from "@platform/theme-system";

const themes = getRegisteredThemes();

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./registry/**/*.{js,ts,jsx,tsx}",
    "../../packages/core-components/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/themes/*/*.{js,ts,jsx,tsx}",
    "../../packages/themes/*/components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: themes.map((t) =>
    createThemePlugin(t.config, { selector: `:where([data-theme="${t.name}"])` })
  ),
};

export default config;
