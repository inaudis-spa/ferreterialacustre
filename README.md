# Ferretería Lacustre — sitio web

Vitrina comercial y catálogo consultable para Ferretería Lacustre. La web usa HTML, CSS y JavaScript, junto con PHP y MySQL para el catálogo, las fichas y el mantenedor.

La portada abre directamente. El video inicial está disponible en «Ver presentación». El video de fondo solo se carga en pantallas grandes con movimiento habilitado.

## Uso local

Abrir `http://localhost/ferreterialacustre/` con Laragon iniciado. La web requiere PHP y MySQL para cargar el catálogo, por lo que no debe abrirse `index.html` directamente.

## Instalación del mantenedor

1. Importar `database/schema.sql` y luego `database/seed_products.sql` en MySQL usando codificación UTF-8 (`--default-character-set=utf8mb4` si se utiliza la consola).
2. Copiar `config.example.php` como `config.php` y ajustar las credenciales de MySQL si corresponde.
3. Crea el primer administrador desde una terminal, con el script existente:
   `php scripts/create-admin.php correo@dominio.cl "una-clave-de-12-o-mas-caracteres" "Nombre"`
   Para instalación local mediante el navegador, habilita temporalmente `allow_web_setup` en `config.php`, abre `/instalar/` y vuelve a deshabilitarlo. En producción debe quedar apagado.
4. Abrir `http://localhost/ferreterialacustre/admin/`.

El panel permite administrar productos, categorías, fotos de producto, medios del sitio con historial y la biblioteca de fotos de ofertas. Las cargas quedan separadas en `uploads/images` y `uploads/videos`; Apache bloquea allí la ejecución de scripts.

El catálogo completo está en `catalogo.html`. La portada consulta únicamente productos publicados marcados como **Destacado** en el mantenedor.

## Flujo comercial

- El visitante busca o filtra productos.
- Agrega productos y cantidades a “Mi cotización”. La lista se conserva en el navegador.
- La solicitud se envía al WhatsApp `+56 9 7291 2278`.
- El mensaje es una consulta: no cobra, no reserva inventario ni crea una orden.

## Contenido pendiente de confirmar

- Horarios y enlaces de fichas de Google Business Profile de Villarrica, Labranza y Cunco. Los enlaces actuales de mapa buscan por dirección.
- Políticas de retiro, despacho y cobertura.
- Catálogo definitivo, precios, marcas y disponibilidad.
- Dominio público final y publicación del sitemap.

Los productos actuales se construyeron exclusivamente a partir de las fotografías proporcionadas y se presentan sin precio ni promesa de stock.

## Publicación y SEO

- Define la URL pública HTTPS completa en `LACUSTRE_SITE_URL` o en `site_url` de `config.php`. Incluye la ruta base si se publica en una subcarpeta. No utilices una URL de pruebas en producción.
- Envía `/sitemap.xml` a Search Console si Apache aplica las reglas de `.htaccess`. Sin esas reglas, usa `/sitemap.php`. El sitemap solo incluye productos publicados e indexables y requiere la URL pública configurada. La portada y otras páginas HTML conservan canónicas relativas a su directorio.
- La URL nueva de cada ficha es `producto.php?id=...`. Apache redirige las antiguas URL de `producto.html`; sin esas reglas, el navegador conserva una transición por JavaScript.
- En Apache conserva la protección de `uploads/.htaccess` y la del archivo raíz. En otros servidores traslada las reglas equivalentes. Mantén el panel bajo HTTPS y configura el límite de intentos de acceso a nivel de hosting.
- La cotización continúa en WhatsApp. No se agrega pago, pedido ni reserva de inventario.
