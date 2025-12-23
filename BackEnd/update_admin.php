<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Current users:\n";
echo "==============\n";

$users = DB::table('users')->select('id', 'name', 'email', 'role')->get();

foreach ($users as $user) {
    echo "ID: {$user->id} | Name: {$user->name} | Email: {$user->email} | Role: {$user->role}\n";
}

echo "\n\nEnter the email of the user you want to make admin: ";
$email = trim(fgets(STDIN));

if (empty($email)) {
    echo "No email provided. Exiting.\n";
    exit;
}

$updated = DB::table('users')
    ->where('email', $email)
    ->update(['role' => 'admin']);

if ($updated) {
    echo "\n✓ User with email '{$email}' has been updated to admin role!\n";
    
    echo "\nUpdated user:\n";
    $user = DB::table('users')->where('email', $email)->first();
    echo "ID: {$user->id} | Name: {$user->name} | Email: {$user->email} | Role: {$user->role}\n";
} else {
    echo "\n✗ No user found with email '{$email}'\n";
}
