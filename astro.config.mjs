import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// --- Domaine personnalisé (GitHub Pages) -------------------------------------
// Le site est servi à la racine de https://willie-leroux.fr
// (fichier public/CNAME + DNS OVH : A -> GitHub Pages, www -> salesdoc1wl.github.io)
export default defineConfig({
  site: 'https://willie-leroux.fr',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { format: 'directory' },
  image: {
    // Astro 4 native image optimization — auto WebP + AVIF
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [{ protocol: 'https' }],
  },
});
