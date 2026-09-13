import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

/**
 * EditorManager — Gestiona el lifecycle de Crepe (Milkdown).
 *
 * Re-quered DOM refs en init() para garantizar que el contenedor
 * tiene dimensiones cuando Crepe se construye.
 */
export class EditorManager {
  private containerId: string;
  private textareaId: string;
  private _editor: Crepe | null = null;

  constructor(containerId: string, textareaId: string) {
    this.containerId = containerId;
    this.textareaId = textareaId;
  }

  private get container(): HTMLElement {
    return document.getElementById(this.containerId)!;
  }

  private get textarea(): HTMLTextAreaElement {
    return document.getElementById(this.textareaId) as HTMLTextAreaElement;
  }

  async init(content: string): Promise<void> {
    console.log("[Editor] init: destroying previous instance...");
    // Always destroy previous instance first
    if (this._editor) {
      try {
        await this._editor.destroy();
      } catch {
        // destroy() may throw if editor is in bad state — ignore
      }
      this._editor = null;
    }

    console.log("[Editor] init: querying DOM for", this.containerId, this.textareaId);
    const el = this.container;
    const ta = this.textarea;

    if (!el || !ta) {
      const msg = `Editor DOM elements not found: #${this.containerId}, #${this.textareaId}`;
      console.error("[Editor] init:", msg);
      throw new Error(msg);
    }

    console.log("[Editor] init: container found, dimensions:", el.offsetWidth, "x", el.offsetHeight);

    // Clear and set initial value
    el.innerHTML = "";
    ta.value = content;

    // Create fresh Crepe instance
    console.log("[Editor] init: creating Crepe instance...");
    this._editor = new Crepe({
      root: el,
      defaultValue: content,
    });

    // Register listener before create()
    this._editor.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => {
        ta.value = markdown;
      });
    });

    console.log("[Editor] init: calling crepe.create()...");
    await this._editor.create();
    console.log("[Editor] init: Crepe created OK");
  }

  async setContent(text: string): Promise<void> {
    this.textarea.value = text;
    // Recreate editor with new content — Crepe has no replaceContent API
    await this.init(text);
  }

  getContent(): string {
    return this.textarea.value;
  }

  async clear(): Promise<void> {
    this.textarea.value = "";
    // Recreate editor empty
    await this.init("");
  }
}
