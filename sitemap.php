<?php
require __DIR__.'/lib/bootstrap.php';
require __DIR__.'/lib/seo.php';
require __DIR__.'/lib/locations.php';

if (site_base() === '') {
    http_response_code(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Sitemap pendiente de configurar.';
    exit;
}

$paths = ['', 'catalogo.html', 'categorias.html', 'ofertas.html'];
foreach (array_keys(branch_locations()) as $key) $paths[] = 'sucursal.php?local='.rawurlencode($key);
try {
    $products = db()->query('SELECT id FROM products WHERE is_published=1 AND is_indexable=1 ORDER BY id');
    foreach ($products as $row) $paths[] = 'producto.php?id='.(int)$row['id'];
} catch (Throwable $e) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Sitemap temporalmente no disponible.';
    exit;
}

header('Content-Type: application/xml; charset=UTF-8');
echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
foreach ($paths as $path) {
    echo '<url><loc>'.htmlspecialchars(canonical_url($path), ENT_XML1 | ENT_QUOTES, 'UTF-8').'</loc></url>'."\n";
}
echo '</urlset>'."\n";
