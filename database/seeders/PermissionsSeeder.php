<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Company;
class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => 'add companies']); 
        Permission::create(['name' => 'edit companies']);
        Permission::create(['name' => 'add administrators']);
        Permission::create(['name' => 'edit administrators']);
        Permission::create(['name' => 'add employees']);
        Permission::create(['name' => 'edit employees']);
        Permission::create(['name' => 'create loans']);
        Permission::create(['name' => 'view ongoing loans for all companies']);
        Permission::create(['name' => 'view ongoing loans for all employees']);
        Permission::create(['name' => 'add payroll officers']);
        Permission::create(['name' => 'edit payroll officers']);
        Permission::create(['name' => 'view receivables dashboard']);
        Permission::create(['name' => 'modify capital']);
        Permission::create(['name' => 'acknowledge loans']);
        Permission::create(['name' => 'complete loans']);
        Permission::create(['name' => 'view own receivables dashboard']);
        Permission::create(['name' => 'modify own capital']);
        Permission::create(['name' => 'request for a loan']);
        Permission::create(['name' => 'view current loan']);
        Permission::create(['name'=> 'modify and approve loans for employees under their company']);
       
        
        $owner = Role::create(['name' => 'owner']);
        $owner->givePermissionTo('add companies');
        $owner->givePermissionTo('edit companies');
        $owner->givePermissionTo('add administrators');
        // soo on

        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo('add companies');
        $admin->givePermissionTo('edit companies');
        $admin->givePermissionTo('add administrators');


        $payroll_officer = Role::create(['name' => 'payroll_officer']);
        $payroll_officer->givePermissionTo('add employees');
        $payroll_officer->givePermissionTo('edit employees');
        $payroll_officer->givePermissionTo('create loans');
        $payroll_officer->givePermissionTo('view ongoing loans for all employees');
        $payroll_officer->givePermissionTo('modify and approve loans for employees under their company');
        $payroll_officer->givePermissionTo('view own receivables dashboard');
        $payroll_officer->givePermissionTo('modify own capital');

        $employee = Role::create(['name' => 'employee']);
        $employee->givePermissionTo('request for a loan');
        $employee->givePermissionTo('view current loan');




        //create  users
        $user = \App\Models\User::factory()->create([
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => 'passwordstrong', // Hash the password
        ]);
        $user->assignRole($owner);

        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Admin',
        //     'email' => 'admin@example.com',
        //     'password' => 'passwordstrong', // Hash the password
        //     'company_id' => 1,
        
        // ]);
        // $user->assignRole($admin);

        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Payroll Officer',
        //     'email' => 'payroll@example.com',
        //     'password' => 'password', // Hash the password
        //     'company_id' => 1,
        
        // ]);
        // $user->assignRole($payroll_officer);


        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Employee',
        //     'email' => 'employee@example.com',
        //     'password' => 'password', // Hash the password
        //     'company_id' => 1,
        
        // ]);
        // $user->assignRole($employee);





        // //create  users
        // $user2 = \App\Models\User::factory()->create([
        //     'name' => 'Owner2',
        //     'email' => 'owner2@example.com',
        //     'password' => 'passwordstrong', // Hash the password
        //     'company_id' => 2,
        // ]);
        // $user2->assignRole($owner);



    }
}
