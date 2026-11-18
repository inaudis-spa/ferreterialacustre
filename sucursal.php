<?php
require __DIR__.'/lib/bootstrap.php';
require __DIR__.'/lib/seo.php';
require __DIR__.'/lib/locations.php';

$key = is_string($_GET['local'] ?? null) ? $_GET['local'] : '';
$branch = branch_locations()[$key] ?? null;
if (!$branch) http_response_code(404);
$title = $branch ? 'Ferretería Lacustre en '.$branch['name'] : 'Sucursal no encontrada';
$canonical = canonical_url('sucursal.php?local='.rawurlencode($key));
if ($branch) {
    $description = 'Visita Ferretería Lacustre en '.$branch['name'].', '.$branch['street'].'. Consulta horarios y disponibilidad por WhatsApp.';
    $maps = 'https://www.google.com/maps/search/?api=1&query='.rawurlencode('Ferretería Lacustre, '.$branch['street'].', '.$branch['city'].', Chile');
    $whatsapp = 'https://wa.me/56972912278?text='.rawurlencode('Hola, quisiera consultar horario o disponibilidad en la sucursal de '.$branch['name'].'.');
    $schema = [
        '@context'=>'https://schema.org', '@type'=>'HardwareStore', 'name'=>$title,
        'telephone'=>'+56972912278', 'hasMap'=>$maps,
        'address'=>['@type'=>'PostalAddress','streetAddress'=>$branch['street'],'addressLocality'=>$branch['city'],'addressRegion'=>'La Araucanía','addressCountry'=>'CL'],
    ];
    if (site_base() !== '') {
        $schema['url'] = $canonical;
        $schema['@id'] = $canonical.'#local';
    }
}
?>
<!doctype html>
<html lang="es-CL">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?=h($title)?></title>
  <?php if ($branch): ?>
  <meta name="description" content="<?=h($description)?>">
  <link rel="canonical" href="<?=h($canonical)?>">
  <script type="application/ld+json"><?=json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES)?></script>
  <?php else: ?><meta name="robots" content="noindex"><?php endif; ?>
  <link rel="stylesheet" href="styles.css">
  <script type="module" src="site-nav.js"></script>
</head>
<body class="catalog-page">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="site-header catalog-header"><div class="header-inner"><a class="brand" href="index.html"><img src="ferreterialacustre/logo-circular-de-ferreteria-lacustre.png" alt="" width="64"><span>Ferretería<br><strong>Lacustre</strong></span></a><nav aria-label="Navegación principal"><a href="index.html">Inicio</a><a href="catalogo.html">Catálogo</a><a href="categorias.html">Categorías</a><a href="ofertas.html">Ofertas</a><a href="index.html#locales">Locales</a></nav><a class="btn btn-primary" href="https://wa.me/56972912278">WhatsApp</a></div></header>
<main id="contenido" class="shell branch-detail">
  <a class="product-back" href="index.html#locales">← Todas las sucursales</a>
  <p class="kicker">La Araucanía · Chile</p>
  <h1><?=h($title)?></h1>
  <?php if ($branch): ?>
    <address><?=h($branch['street'])?>, <?=h($branch['city'])?>, La Araucanía.</address>
    <p>Consulta el horario de atención y la disponibilidad de herramientas y materiales antes de tu visita.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="<?=h($maps)?>" target="_blank" rel="noopener">Cómo llegar en Google Maps ↗</a>
      <a class="btn btn-dark" href="<?=h($whatsapp)?>" target="_blank" rel="noopener">Consultar por WhatsApp ↗</a>
    </div>
    <p><a href="tel:+56972912278">Llamar al +56 9 7291 2278</a> · <a href="catalogo.html">Ver catálogo</a></p>
  <?php else: ?><p>Vuelve al listado para encontrar el local que buscas.</p><?php endif; ?>
</main>
</body>
</html>
