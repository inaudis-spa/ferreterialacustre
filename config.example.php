<?php
return [
    'site_url' => '', // URL pública completa, incluida la subcarpeta si existe.
    'allow_web_setup' => false, // Habilitar solo durante la instalación local, si se necesita.
    'db' => ['dsn' => 'mysql:host=127.0.0.1;dbname=ferreteria_lacustre;charset=utf8mb4', 'user' => 'root', 'pass' => ''],
    'image_max' => 8 * 1024 * 1024,
    'video_max' => 40 * 1024 * 1024,
];
