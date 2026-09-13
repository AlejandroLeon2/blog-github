import { GitHubClient, type GitHubFile } from "./github-client";
import { EditorManager } from "./editor-manager";
import { MarkdownSerializer, type Frontmatter } from "./markdown-serializer";
import { toast } from "./toast";
import { getToken, setToken, removeToken } from "./auth";

// ========================================================
//  DOM HELPERS — null-safe, single responsibility
// ========================================================

function $el(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function $input(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}

function $select(id: string): HTMLSelectElement | null {
  return document.getElementById(id) as HTMLSelectElement | null;
}

/**
 * CMS — Orquestador del panel de administración.
 *
 * Coordina auth, CRUD de archivos, imágenes y editor.
 * Dependencias inyectadas: GitHubClient (API) y EditorManager (editor).
 * Frontmatter parsing delegado a MarkdownSerializer (SRP).
 */
export class CMS {
  private currentSha: string | null = null;
  private currentPath: string | null = null;

  private api: GitHubClient;
  private editor: EditorManager;

  // DOM refs — resolved lazily
  private el = {
    get login() { return $el("login"); },
    get cms() { return $el("cms"); },
    get tokenInput() { return $input("token"); },
    get userEl() { return $el("user"); },
    get files() { return $select("files"); },
    get filename() { return $input("filename"); },
    get output() { return $el("output"); },
    get fmTitle() { return $input("fm-title"); },
    get fmDescription() { return $input("fm-description"); },
    get fmPubDate() { return $input("fm-pubDate"); },
    get fmHeroImage() { return $select("fm-heroImage"); },
    get fmCategory() { return $select("fm-category"); },
    get fmTags() { return $input("fm-tags"); },
    get imageModal() { return $el("image-modal"); },
    get imageFileInput() { return $input("image-file-input"); },
    get imagePreview() { return document.getElementById("image-preview") as HTMLImageElement | null; },
  };

  constructor(api: GitHubClient, editor: EditorManager) {
    this.api = api;
    this.editor = editor;
    this.bindEvents();
  }

  // ========================================================
  //  PUBLIC
  // ========================================================

  async autoLogin(): Promise<void> {
    const token = getToken();
    if (!token) {
      console.log("[CMS] autoLogin: no token, showing login form");
      return;
    }
    console.log("[CMS] autoLogin: token found, connecting...");
    try {
      await this.connect(token);
    } catch (e) {
      console.error("[CMS] autoLogin: connect failed", e);
      // connect() already handles error UI
    }
  }

  // ========================================================
  //  AUTH
  // ========================================================

  async connect(token: string): Promise<void> {
    console.log("[CMS] connect: starting");
    this.log("Conectando...");

    // Save token FIRST — getUser() reads from localStorage
    setToken(token);

    // Step 1: Validate token
    let user: { login: string };
    try {
      console.log("[CMS] connect: validating token with GitHub API...");
      user = await this.api.getUser();
      console.log("[CMS] connect: token valid, user:", user.login);
    } catch (e: any) {
      console.error("[CMS] connect: token validation failed", e.message);
      removeToken();
      this.hideOutput();
      toast(e.message, "error");
      throw e;
    }
    console.log("[CMS] connect: token saved, showing CMS UI");
    this.el.login && (this.el.login.hidden = true);
    this.el.cms && (this.el.cms.hidden = false);
    if (this.el.userEl) this.el.userEl.textContent = user.login;
    this.hideOutput();
    toast("Conectado correctamente.", "success");

    // Step 3: Wait one frame so browser layout is computed after unhiding
    console.log("[CMS] connect: waiting for layout...");
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    console.log("[CMS] connect: layout ready, initializing editor");

    // Step 4: Initialize editor — failure here should NOT log user out
    try {
      await this.editor.init("");
      console.log("[CMS] connect: editor initialized OK");
    } catch (e: any) {
      console.error("[CMS] connect: editor init FAILED", e);
      toast("Error al iniciar el editor.", "error");
    }

    // Step 5: Load files and images — independent failures are non-fatal
    try {
      await this.loadFiles();
      console.log("[CMS] connect: files loaded OK");
    } catch (e: any) {
      console.error("[CMS] connect: loadFiles FAILED", e);
    }

    try {
      await this.loadImages();
      console.log("[CMS] connect: images loaded OK");
    } catch (e: any) {
      console.error("[CMS] connect: loadImages FAILED", e);
    }

    console.log("[CMS] connect: ALL DONE");
  }

  logout(): void {
    removeToken();
    location.reload();
  }

  // ========================================================
  //  FILE OPERATIONS
  // ========================================================

  async loadFiles(): Promise<void> {
    this.log("Cargando archivos...");
    try {
      const fileList = await this.api.listFiles();
      if (fileList.length === 0) {
        if (this.el.files) {
          this.el.files.innerHTML = '<option value="">No hay artículos todavía</option>';
        }
        toast("No hay artículos. Creá el primero.", "info");
        return;
      }
      this.populateSelect(fileList);
      this.log("Archivos cargados.");
    } catch (e: any) {
      toast(e.message, "error");
      this.log("ERROR:\n" + e.message);
    }
  }

  async loadImages(): Promise<void> {
    try {
      const imageList = await this.api.listImages();
      this.populateImageSelect(imageList);
    } catch {
      // silent — images dir may not exist yet
    }
  }

  async uploadImage(file: File): Promise<void> {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      this.log(`Subiendo ${file.name}...`);
      try {
        await this.api.uploadImage(file.name, base64);
        toast("Imagen subida.", "success");
        this.hideOutput();
        await this.loadImages();
        if (this.el.fmHeroImage) this.el.fmHeroImage.value = `/images/${file.name}`;
        this.closeImageModal();
      } catch (e: any) {
        this.log(`ERROR: ${e.message}`);
        toast(`Error al subir: ${e.message}`, "error");
      }
    };
    reader.readAsDataURL(file);
  }

  async openFile(path: string): Promise<void> {
    this.log("Leyendo archivo...");
    try {
      const file = await this.api.getFile(path);
      this.currentSha = file.sha;
      this.currentPath = path;
      if (this.el.filename) this.el.filename.value = file.name;

      const { frontmatter, body } = MarkdownSerializer.parse(file.content);
      this.populateForm(frontmatter);
      await this.editor.setContent(body);

      this.log("Archivo cargado.");
    } catch (e: any) {
      toast(e.message, "error");
      this.log(e.message);
    }
  }

  async newFile(): Promise<void> {
    if (this.el.files) this.el.files.value = "";
    if (this.el.filename) this.el.filename.value = "nuevo-articulo.md";
    this.currentSha = null;
    this.currentPath = null;

    const today = new Date().toISOString().split("T")[0];
    this.populateForm({
      title: "Nuevo artículo",
      description: "Descripción",
      pubDate: today,
      heroImage: "",
      category: "general",
      tags: "",
    });
    await this.editor.setContent("# Nuevo artículo\n\nEscribe aquí tu contenido.\n");
    toast("Nuevo archivo.", "info");
  }

  async saveFile(): Promise<void> {
    let name = this.el.filename?.value.trim() ?? "";
    if (!name) { toast("Introduce un nombre.", "error"); return; }
    if (!name.endsWith(".md")) name += ".md";

    this.log("Guardando en GitHub...");
    try {
      const fm = this.readForm();
      const body = this.editor.getContent();
      const fullContent = MarkdownSerializer.serialize(fm, body);

      if (this.currentSha && this.currentPath) {
        await this.api.updateFile(this.currentPath, fullContent, this.currentSha, name);
      } else {
        await this.api.createFile(name, fullContent);
      }

      toast("Guardado correctamente.", "success");
      this.log("Guardado correctamente.");
      await this.loadFiles();
    } catch (e: any) {
      toast(e.message, "error");
      this.log("ERROR:\n" + e.message);
    }
  }

  async deleteFile(): Promise<void> {
    const path = this.el.files?.value;
    if (!path || !this.currentSha) {
      toast("Selecciona un archivo.", "error");
      return;
    }
    if (!confirm("¿Eliminar este archivo?")) return;

    this.log("Eliminando...");
    try {
      await this.api.deleteFile(path, this.currentSha);
      await this.resetAll();
      toast("Archivo eliminado.", "success");
      this.log("Archivo eliminado.");
      await this.loadFiles();
    } catch (e: any) {
      toast(e.message, "error");
      this.log(e.message);
    }
  }

  // ========================================================
  //  PRIVATE — DOM
  // ========================================================

  private populateForm(fm: Frontmatter): void {
    if (this.el.fmTitle) this.el.fmTitle.value = fm.title;
    if (this.el.fmDescription) this.el.fmDescription.value = fm.description;
    if (this.el.fmPubDate) this.el.fmPubDate.value = fm.pubDate;
    if (this.el.fmHeroImage) this.el.fmHeroImage.value = fm.heroImage;
    if (this.el.fmCategory) this.el.fmCategory.value = fm.category;
    if (this.el.fmTags) this.el.fmTags.value = fm.tags;
  }

  private readForm(): Frontmatter {
    return {
      title: this.el.fmTitle?.value.trim() ?? "",
      description: this.el.fmDescription?.value.trim() ?? "",
      pubDate: this.el.fmPubDate?.value ?? "",
      heroImage: this.el.fmHeroImage?.value.trim() ?? "",
      category: this.el.fmCategory?.value ?? "general",
      tags: this.el.fmTags?.value.trim() ?? "",
    };
  }

  private log(msg: string): void {
    if (!this.el.output) return;
    this.el.output.textContent = msg;
    this.el.output.classList.remove("hidden");
  }

  private hideOutput(): void {
    this.el.output?.classList.add("hidden");
  }

  private populateSelect(fileList: GitHubFile[]): void {
    if (!this.el.files) return;
    this.el.files.innerHTML = '<option value="">Selecciona un archivo</option>';
    fileList
      .filter((f) => f.name.endsWith(".md"))
      .forEach((f) => {
        const opt = document.createElement("option");
        opt.value = f.path;
        opt.textContent = f.name;
        this.el.files!.appendChild(opt);
      });
  }

  private populateImageSelect(imageList: GitHubFile[]): void {
    if (!this.el.fmHeroImage) return;
    this.el.fmHeroImage.innerHTML = '<option value="">Sin imagen</option>';
    imageList
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name))
      .forEach((f) => {
        const opt = document.createElement("option");
        opt.value = `/images/${f.name}`;
        opt.textContent = f.name;
        this.el.fmHeroImage!.appendChild(opt);
      });
  }

  openImageModal(): void {
    this.el.imageModal?.classList.remove("hidden");
    if (this.el.imageFileInput) this.el.imageFileInput.value = "";
    this.el.imagePreview?.classList.add("hidden");
  }

  closeImageModal(): void {
    this.el.imageModal?.classList.add("hidden");
  }

  private async resetAll(): Promise<void> {
    if (this.el.filename) this.el.filename.value = "";
    this.populateForm(MarkdownSerializer.empty());
    await this.editor.clear();
    this.currentSha = null;
    this.currentPath = null;
  }

  // ========================================================
  //  PRIVATE — Events
  // ========================================================

  private bindEvents(): void {
    const safeBind = (id: string, event: string, handler: EventListener) => {
      $el(id)?.addEventListener(event, handler);
    };

    safeBind("connect", "click", () => {
      const token = this.el.tokenInput?.value.trim();
      if (!token) { toast("Introduce el token.", "error"); return; }
      this.connect(token);
    });

    safeBind("logout", "click", () => this.logout());
    safeBind("newFile", "click", () => this.newFile());
    safeBind("save", "click", () => this.saveFile());
    safeBind("delete", "click", () => this.deleteFile());

    this.el.files?.addEventListener("change", async () => {
      if (this.el.files!.value) await this.openFile(this.el.files!.value);
      else await this.resetAll();
    });

    safeBind("upload-image-btn", "click", () => this.openImageModal());
    safeBind("close-image-modal", "click", () => this.closeImageModal());
    safeBind("cancel-image-modal", "click", () => this.closeImageModal());

    this.el.imageFileInput?.addEventListener("change", () => {
      const file = this.el.imageFileInput!.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      if (this.el.imagePreview) {
        this.el.imagePreview.src = url;
        this.el.imagePreview.classList.remove("hidden");
      }
    });

    safeBind("confirm-image-upload", "click", () => {
      const file = this.el.imageFileInput?.files?.[0];
      if (!file) { toast("Seleccioná una imagen.", "error"); return; }
      this.uploadImage(file);
    });
  }
}
