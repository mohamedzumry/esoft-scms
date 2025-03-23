<?php

use App\Http\Controllers\Dashboard\ChatController;
use App\Http\Controllers\Dashboard\Event\EventCategoryController;
use App\Http\Controllers\Dashboard\Event\EventController;
use App\Http\Controllers\Dashboard\ReservationController;
use App\Http\Controllers\Dashboard\ResourceController;
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
                ],
                [
                    'id' => 3,
                    'title' => 'Advanced Mathematics',
                    'instructor' => 'Dr. Smith',
                    'enrollments' => 45
                ],
            ]
        ]);
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard/users', [UserController::class, 'index'])->name('dashboard.users');

    // Events
    Route::get('dashboard/events', [EventController::class, 'index'])->name('events.index');
    Route::post('dashboard/event-create', [EventController::class, 'store'])->name('events.store');
    Route::get('dashboard/event/{id}/edit', [EventController::class, 'edit'])->name('event.edit');
    Route::put('dashboard/event-edit', [EventController::class, 'update'])->name('event.update');
    Route::delete('dashboard/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');

    // Event Categories
    Route::get('dashboard/event-categories', [EventCategoryController::class, 'index'])->name('event-categories.index');
    Route::post('dashboard/event-category', [EventCategoryController::class, 'store'])->name('event-categories.store');
    Route::delete('dashboard/event-category/{category}', [EventCategoryController::class, 'destroy'])
        ->name('event-categories.destroy');

    // Resource
    Route::get('dashboard/resources', [ResourceController::class, 'index'])->name('resources.index');
    Route::post('dashboard/resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::delete('dashboard/resources/{id}', [ResourceController::class, 'destroy'])->name('resources.destroy');

    // Reservation
    Route::get('dashboard/reservations', [ReservationController::class, 'index'])->name('reservations.index');
    Route::post('dashboard/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::put('/reservations/{reservation}/approve', [ReservationController::class, 'approve'])->name('reservations.approve');
    Route::put('/reservations/{reservation}/reject', [ReservationController::class, 'reject'])->name('reservations.reject');
    Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::delete('dashboard/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

    // Chat
    Route::get('/dashboard/chats', [ChatController::class, 'index'])->name('chats.index');
    Route::get('/dashboard/chats/{chat}', [ChatController::class, 'show'])->name('chats.show');
    Route::post('/dashboard/chats/{chat}/messages', [ChatController::class, 'sendMessage'])->name('chats.messages.store');
    Route::post('dashboard/chats', [ChatController::class, 'store'])->name('chats.store');
    Route::post('dashboard/chats/{chat}/messages', [ChatController::class, 'sendMessage'])->name('chats.messages.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
