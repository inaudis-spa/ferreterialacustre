<?php
declare(strict_types=1);

function h(mixed $value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function site_base(): string {
    global $config;
    $base = rtrim(trim((string)(getenv('LACUSTRE_SITE_URL') ?: ($config['site_url'] ?? ''))), '/');
    if (!filter_var($base, FILTER_VALIDATE_URL)) return '';
    $url = parse_url($base);
    if (!in_array($url['scheme'] ?? '', ['http', 'https'], true)
        || isset($url['user']) || isset($url['pass']) || isset($url['query']) || isset($url['fragment'])) return '';
    return $base;
}

function canonical_url(string $path): string {
    $base = site_base();
    return $base !== '' ? $base . '/' . ltrim($path, '/') : $path;
}
