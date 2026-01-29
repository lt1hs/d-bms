<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Book::create([
            'category' => 'الكتب',
            'title' => 'مبادئ البرمجة للمبتدئين',
            'author' => 'أحمد العلي',
            'status' => 'مطبوع',
            'publication_year' => '2023',
            'isbn' => '978-3-16-148410-0',
            'image' => '/images/book-1.jpg',
        ]);

        \App\Models\Book::create([
            'category' => 'مجلة الدليل',
            'title' => 'مجلة الدليل - العدد 45',
            'author' => 'هيئة التحرير',
            'status' => 'قيد الطباعة',
            'publication_year' => '2024',
            'isbn' => 'ISSN-1234-5678',
            'image' => '/images/magazine-1.jpg',
        ]);
    }
}
