<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MakeAdmin extends Command
{
    protected $signature = 'user:make-admin {email}';
    protected $description = 'Make a user admin by email';

    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email '{$email}' not found!");
            
            $this->info("\nAll users:");
            $users = User::all(['id', 'name', 'email', 'role']);
            foreach ($users as $u) {
                $this->line("{$u->id} | {$u->name} | {$u->email} | Role: {$u->role}");
            }
            
            return 1;
        }
        
        $user->role = 'admin';
        $user->save();
        
        $this->info("✓ User '{$user->name}' ({$user->email}) is now an admin!");
        
        return 0;
    }
}
