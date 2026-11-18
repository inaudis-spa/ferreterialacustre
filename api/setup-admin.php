<?php
require __DIR__.'/../lib/bootstrap.php';
if (!web_setup_allowed()) json_response(['error'=>'Página no disponible'], 404);
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET','POST'], true)) {
    header('Allow: GET, POST');
    json_response(['error'=>'Método no permitido'], 405);
}
try {
    $count=(int)db()->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    if($_SERVER['REQUEST_METHOD']==='GET') json_response(['setup_required'=>$count===0,'csrf'=>$count===0?csrf():null]);
    if($count!==0) json_response(['error'=>'La instalación inicial ya fue completada.'],403);
    require_csrf();$d=input();$name=trim($d['name']??'');$email=strtolower(trim($d['email']??''));$password=(string)($d['password']??'');$confirm=(string)($d['password_confirm']??'');
    if(mb_strlen($name)<2) json_response(['error'=>'Ingresa el nombre del administrador.'],422);
    if(!filter_var($email,FILTER_VALIDATE_EMAIL)) json_response(['error'=>'Ingresa un correo válido.'],422);
    if(strlen($password)<12) json_response(['error'=>'La contraseña debe tener al menos 12 caracteres.'],422);
    if(!preg_match('/[A-Z]/',$password)||!preg_match('/[a-z]/',$password)||!preg_match('/\d/',$password)) json_response(['error'=>'Usa mayúsculas, minúsculas y números.'],422);
    if(!hash_equals($password,$confirm)) json_response(['error'=>'Las contraseñas no coinciden.'],422);
    db()->beginTransaction();
    if((int)db()->query('SELECT COUNT(*) FROM admin_users FOR UPDATE')->fetchColumn()!==0){db()->rollBack();json_response(['error'=>'El administrador ya fue creado en otra sesión.'],409);}
    $q=db()->prepare('INSERT INTO admin_users(email,password_hash,name,is_active) VALUES(?,?,?,1)');$q->execute([$email,password_hash($password,PASSWORD_DEFAULT),$name]);$id=(int)db()->lastInsertId();db()->commit();
    session_start_safe();session_regenerate_id(true);$_SESSION['admin']=['id'=>$id,'email'=>$email,'name'=>$name];$_SESSION['csrf']=bin2hex(random_bytes(24));json_response(['ok'=>true,'redirect'=>'../admin/']);
} catch(Throwable $e) { json_response(['error'=>'No fue posible completar la instalación. Verifica la base de datos.'],500); }
