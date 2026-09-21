export const metadata = {
  title: "Panchería Express POS",
  description: "Sistema POS y control de inventario desarrollado en Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-100 text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
