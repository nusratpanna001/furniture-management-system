<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'login@gmail.com',   // Login email
            'phone' => '0123456789',
            'address' => 'Dhaka',
            'role' => 'admin',
            'password' => Hash::make('12345678'), // Login password
        ]);
    }
}
