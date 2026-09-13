import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.string(),
    updatedDate: z.string().optional(),
    heroImage: z.string().optional(),
    category: z.string().default("general"),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
