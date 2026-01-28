<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'username' => 'superadmin-d',
            'password' => bcrypt('bms@admin110-D'),
            'role' => 'SUPER_ADMIN',
            'permissions' => json_encode(['canAdd' => true, 'canEdit' => true, 'canDelete' => true, 'canHide' => true]),
        ]);

        $this->call([
            BookSeeder::class,
        ]);
    }
}
