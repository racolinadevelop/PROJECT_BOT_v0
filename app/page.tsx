
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Bienvenido a <span className="text-primary">Traca</span>Bot <span className="text-secondary">Store</span>
      </h1>
      <p className="opacity-80 max-w-xl">
        Explora el catálogo vibrante, con modo claro/oscuro, animaciones y carrito listo para conectar a tu backend.
      </p>
      <Link
        href="/tienda-de-ventas"
        className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-2xl px-5 py-3 font-semibold"
      >
        Ver catálogo de ejemplo
      </Link>
    </main>
  );
}
