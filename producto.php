<?php
require __DIR__.'/lib/bootstrap.php';
require __DIR__.'/lib/seo.php';
require __DIR__.'/lib/product-data.php';

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]]) ?: 0;
$product = null;
$unavailable = false;
try {
    if ($id) $product = published_product($id);
} catch (Throwable $e) {
    $unavailable = true;
}
if (!$product) http_response_code($unavailable ? 503 : 404);
$title = $product ? ($product['seo_title'] ?: $product['name'].' | Ferretería Lacustre') : ($unavailable ? 'Catálogo temporalmente no disponible' : 'Producto no disponible');
$description = $product ? ($product['seo_description'] ?: ($product['short_description'] ?: 'Consulta características, precio y disponibilidad de '.$product['name'].' en Ferretería Lacustre.')) : '';
$images = $product['images'] ?? [];
$cover = $images[0] ?? null;
$whatsapp = $product ? 'https://wa.me/56972912278?text='.rawurlencode('Hola Ferretería Lacustre, quisiera consultar por '.$product['name'].'.') : 'https://wa.me/56972912278';
?>
<!doctype html>
<html lang="es-CL">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?=h($title)?></title>
  <?php if ($product): ?>
  <meta name="description" content="<?=h($description)?>">
  <link rel="canonical" href="<?=h(canonical_url('producto.php?id='.$product['id']))?>">
  <?php endif; ?>
  <?php if (!$unavailable && (!$product || !(int)$product['is_indexable'])): ?>
  <meta name="robots" content="noindex">
  <?php endif; ?>
  <link rel="stylesheet" href="styles.css">
  <script type="module" src="producto.js"></script>
</head>
<body class="catalog-page">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="site-header catalog-header"><div class="header-inner"><a class="brand" href="index.html"><img src="ferreterialacustre/logo-circular-de-ferreteria-lacustre.png" alt="" width="64"><span>Ferretería<br><strong>Lacustre</strong></span></a><nav aria-label="Navegación principal"><a href="index.html">Inicio</a><a href="catalogo.html">Catálogo</a><a href="categorias.html">Categorías</a><a href="ofertas.html">Ofertas</a><a href="index.html#locales">Locales</a></nav><a class="btn btn-primary" href="https://wa.me/56972912278">WhatsApp</a></div></header>
<main id="contenido"><section class="product-detail shell" id="product-detail">
  <?php if ($product): ?>
  <div class="product-gallery">
    <div class="product-main-image">
      <?php if ($cover): ?>
      <img id="main-product-image" src="<?=h(product_image_url($cover['path']))?>" alt="<?=h($cover['alt_text'] ?: $product['name'])?>" style="object-position:<?=(int)$cover['focal_x']?>% <?=(int)$cover['focal_y']?>%">
      <?php else: ?><div class="no-image">Sin fotografía</div><?php endif; ?>
    </div>
    <?php if (count($images) > 1): ?>
    <div class="product-thumbs" aria-label="Fotografías del producto">
      <?php foreach ($images as $index => $image): ?>
      <button type="button" class="<?=$index === 0 ? 'active' : ''?>" data-image="<?=h(product_image_url($image['path']))?>" data-alt="<?=h($image['alt_text'] ?: $product['name'])?>" data-x="<?=(int)$image['focal_x']?>" data-y="<?=(int)$image['focal_y']?>" aria-label="Ver imagen <?=$index + 1?>" aria-pressed="<?=$index === 0 ? 'true' : 'false'?>"><img src="<?=h(product_image_url($image['path']))?>" alt="" loading="lazy"></button>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
  <div class="product-info">
    <a class="product-back" href="catalogo.html<?=!empty($product['category_slug']) ? '?categoria='.h(rawurlencode($product['category_slug'])) : ''?>">← Volver al catálogo</a>
    <p class="kicker"><?=h($product['category_name'] ?: 'Producto')?></p>
    <h1><?=h($product['name'])?></h1>
    <?php if ($product['brand']): ?><p class="product-brand">Marca <?=h($product['brand'])?></p><?php endif; ?>
    <?php if ($product['short_description']): ?><p class="product-short"><?=h($product['short_description'])?></p><?php endif; ?>
    <div class="product-description"><h2>Descripción</h2><p><?=h($product['long_description'] ?: ($product['short_description'] ?: 'Consulta características y disponibilidad con nuestro equipo.'))?></p></div>
    <div class="detail-prices"><span><?=$product['is_offer'] && $product['price'] !== null ? 'Precio oferta' : 'Precio'?></span><div>
    <?php if ($product['price'] !== null): ?>
      <?php if ($product['is_offer'] && $product['old_price'] > $product['price']): ?><del>$<?=number_format($product['old_price'], 0, ',', '.')?></del><?php endif; ?>
      <strong>$<?=number_format($product['price'], 0, ',', '.')?></strong>
    <?php else: ?><strong>Consultar</strong><?php endif; ?>
    </div></div>
    <div class="product-purchase">
      <div class="detail-qty" hidden><span>Cantidad</span><button type="button" data-qty="minus" aria-label="Reducir cantidad">−</button><strong id="detail-quantity" aria-live="polite">1</strong><button type="button" data-qty="plus" aria-label="Aumentar cantidad">+</button></div>
      <button type="button" id="product-add" class="btn btn-primary" data-id="<?=h($product['id'])?>" hidden>Agregar a mi cotización +</button>
      <a id="product-whatsapp" href="<?=h($whatsapp)?>">Consultar por WhatsApp ↗</a>
      <small>La consulta no reserva stock ni confirma una compra.</small>
    </div>
  </div>
  <?php else: ?>
  <div class="empty-state"><h1><?=h($title)?></h1><p><?=$unavailable ? 'Intenta nuevamente en unos minutos o consulta por WhatsApp.' : 'El producto puede haber sido retirado o despublicado.'?></p><a href="catalogo.html">Volver al catálogo</a> · <a href="<?=h($whatsapp)?>">Contactar por WhatsApp</a></div>
  <?php endif; ?>
</section></main>
<footer><div class="shell footer-grid"><div class="footer-brand"><img src="ferreterialacustre/logo-circular-de-ferreteria-lacustre.png" alt="Ferretería Lacustre" width="112"><p>Soluciones para construir,<br>reparar y avanzar.</p></div><div><strong>Explora</strong><a href="index.html">Inicio</a><a href="catalogo.html">Catálogo</a><a href="ofertas.html">Ofertas</a></div><div><strong>Contacto</strong><a href="tel:+56972912278">+56 9 7291 2278</a><a href="https://www.instagram.com/ferreteria.lacustre/">Instagram</a></div></div></footer>
<div class="social-float"><a class="social-instagram" href="https://www.instagram.com/ferreteria.lacustre/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" class="dot"/></svg></a><a class="social-whatsapp" href="https://wa.me/56972912278" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"/><path d="M8.5 7.8c.3-.4.6-.4.9-.1l1.1 1.5c.2.3.1.6-.1.9l-.5.6c.7 1.5 1.8 2.6 3.3 3.2l.6-.7c.2-.2.5-.3.8-.1l1.6.8c.4.2.4.5.3.9-.4 1-1.3 1.5-2.4 1.4-3.8-.5-6.8-3.4-7.3-7.1-.1-.6.5-1.1 1.7-1.3Z"/></svg></a></div></body></html>
