<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Owner',
                'email' => 'owner@example.com',
                'password' => 'passwordstrong',
                'role' => 'owner',
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => 'passwordstrong',
                'role' => 'admin',
                'company_id' => 1,
            ],
            [
                'name' => 'Payroll Officer',
                'email' => 'payroll@example.com',
                'password' => 'passwordstrong',
                'role' => 'payroll_officer',
                'company_id' => 1,
            ],
            [
                'name' => 'Employee',
                'email' => 'employee@example.com',
                'password' => 'passwordstrong',
                'role' => 'employee',
                'company_id' => 1,
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']); 
            $user = User::factory()->create($userData);
            $role = Role::findByName($roleName);
            $user->assignRole(roles: $role);
        }
    }
}
