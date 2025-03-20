<?php

use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'courses' => [
                'total' => 150,
                'new' => 12
            ],
            'students' => [
                'active' => 850,
                'pending' => 23
            ],
            'lecturers' => [
                'total' => 35,
                'available' => 28
            ],
            'recentCourses' => [
                [
                    'id' => 1,
                    'title' => 'Advanced Mathematics',
                    'instructor' => 'Dr. Smith',
                    'enrollments' => 45
                ],
                [
                    'id' => 2,
                    'title' => 'Advanced Mathematics',
                    'instructor' => 'Dr. Smith',
                    'enrollments' => 45
                ],[
                    'id' => 3,
                    'title' => 'Advanced Mathematics',
                    'instructor' => 'Dr. Smith',
                    'enrollments' => 45
                ],
            ]
        ]);
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard/users', [UserController::class, 'index'])->name('dashboard.users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
