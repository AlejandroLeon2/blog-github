/**
 * Frontmatter — Estructura frontmatter de un post.
 */
export interface Frontmatter {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  category: string;
  tags: string;
}

/**
 * MarkdownSerializer — Parsea y serializa frontmatter + body.
 * SRP: única responsabilidad de convertir entre .md y estructura tipada.
 */
export class MarkdownSerializer {
  static empty(): Frontmatter {
    return {
      title: "",
      description: "",
      pubDate: "",
      heroImage: "",
      category: "general",
      tags: "",
    };
  }

  static parse(raw: string): { frontmatter: Frontmatter; body: string } {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { frontmatter: this.empty(), body: raw };

    const [, fmBlock, body] = match;
    const get = (key: string): string => {
      const line = fmBlock.split("\n").find((l) => l.startsWith(`${key}:`));
      if (!line) return "";
      return line.replace(`${key}:`, "").trim().replace(/^["']|["']$/g, "");
    };

    return {
      frontmatter: {
        title: get("title"),
        description: get("description"),
        pubDate: get("pubDate"),
        heroImage: get("heroImage"),
        category: get("category") || "general",
        tags: get("tags").replace(/[\[\]]/g, ""),
      },
      body,
    };
  }

  static serialize(fm: Frontmatter, body: string): string {
    const lines = [
      "---",
      `title: "${fm.title}"`,
      `description: "${fm.description}"`,
      `pubDate: ${fm.pubDate}`,
    ];
    if (fm.heroImage) lines.push(`heroImage: "${fm.heroImage}"`);
    lines.push(`category: "${fm.category}"`);
    if (fm.tags) {
      lines.push(`tags: [${fm.tags.split(",").map((t) => `"${t.trim()}"`).join(", ")}]`);
    }
    lines.push("---", "");
    return lines.join("\n") + body;
  }
}
