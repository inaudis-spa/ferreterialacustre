<?php
require __DIR__.'/../lib/bootstrap.php';
try {
  if($_SERVER['REQUEST_METHOD']==='GET') json_response(['authenticated'=>(bool)admin(),'admin'=>admin(),'csrf'=>admin()?csrf():null]);
  if($_SERVER['REQUEST_METHOD']!=='POST'){header('Allow: GET, POST');json_response(['error'=>'Método no permitido'],405);}
  $d=input();
  if(($d['action']??'')==='logout'){require_admin();require_csrf();session_destroy();json_response(['ok'=>true]);}
  $q=db()->prepare('SELECT id,email,name,password_hash FROM admin_users WHERE email=? AND is_active=1');$q->execute([strtolower(trim($d['email']??''))]);$u=$q->fetch();
  if(!$u||!password_verify($d['password']??'',$u['password_hash']))json_response(['error'=>'Correo o contraseña incorrectos'],422);
  session_start_safe();session_regenerate_id(true);$_SESSION['admin']=['id'=>(int)$u['id'],'email'=>$u['email'],'name'=>$u['name']];json_response(['ok'=>true,'admin'=>$_SESSION['admin'],'csrf'=>csrf()]);
}catch(Throwable $e){json_response(['error'=>'No fue posible acceder al panel. Revisa la configuración.'],500);}
