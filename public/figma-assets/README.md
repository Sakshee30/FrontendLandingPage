# Figma Asset Cache

Run the following command while the temporary Figma URLs in `src/data/figmaAssets.ts` are valid:

```bash
npm run cache:assets
```

The downloader stores exact Figma raster exports in this folder. The application first loads these local files, then tries the temporary remote URL, then falls back to native SVG/CSS artwork.

Do not commit private or unlicensed source assets without project approval.
