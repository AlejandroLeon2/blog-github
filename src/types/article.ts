export interface ArticleFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  heroImage?: string;
  tags?: string[];
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  body: string;
}
