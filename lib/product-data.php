<?php
declare(strict_types=1);

function published_product(int $id, string $slug = ''): ?array {
    if ($id < 1 && $slug === '') return null;
    $key = $id > 0 ? 'p.id' : 'p.slug';
    $query = db()->prepare("SELECT p.*, c.name category_name, c.slug category_slug
        FROM products p LEFT JOIN categories c ON c.id=p.category_id
        WHERE p.is_published=1 AND $key=? LIMIT 1");
    $query->execute([$id > 0 ? $id : $slug]);
    $product = $query->fetch();
    if (!$product) return null;
    $images = db()->prepare('SELECT id,path,alt_text,is_cover,sort_order,focal_x,focal_y
        FROM product_images WHERE product_id=? ORDER BY is_cover DESC,sort_order,id');
    $images->execute([$product['id']]);
    $product['images'] = $images->fetchAll();
    $product['id'] = (string)$product['id'];
    foreach (['price', 'old_price'] as $field) {
        if ($product[$field] !== null) $product[$field] = (float)$product[$field];
    }
    return $product;
}

function product_image_url(string $path): string {
    return implode('/', array_map('rawurlencode', explode('/', $path)));
}
