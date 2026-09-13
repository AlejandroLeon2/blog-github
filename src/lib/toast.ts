type ToastVariant = "success" | "error" | "info";

/**
 * Dispatch a toast event. Toast.astro listens for this.
 * No global window coupling — clean separation via CustomEvent.
 */
export function toast(msg: string, variant: ToastVariant = "info"): void {
  window.dispatchEvent(
    new CustomEvent("app:toast", { detail: { msg, variant } })
  );
}
