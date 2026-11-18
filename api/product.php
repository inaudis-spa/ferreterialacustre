<?php
require __DIR__.'/../lib/bootstrap.php';
require __DIR__.'/../lib/product-data.php';
try {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]]) ?: 0;
    $slug = is_string($_GET['slug'] ?? null) ? trim($_GET['slug']) : '';
    if (!$id && $slug === '') json_response(['error'=>'Producto no indicado'], 422);
    $product = published_product($id, $slug);
    if (!$product) json_response(['error'=>'Producto no disponible'], 404);
    json_response(['product'=>$product]);
} catch (Throwable $e) {
    json_response(['error'=>'No fue posible cargar el producto'], 503);
}
