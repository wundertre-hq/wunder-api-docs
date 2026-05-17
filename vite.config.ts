import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        enforce: "pre",
        ...mdx({
          providerImportSource: "@mdx-js/react",
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        }),
      },
    ],
  },
});
