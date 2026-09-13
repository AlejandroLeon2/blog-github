export interface Route {
  label: string;
  href: string;
}

export const routes: Route[] = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
  // La ruta de Admin se eliminó — el blog público no la necesita
  // Si se necesita admin, se puede acceder directamente a /admin
];
