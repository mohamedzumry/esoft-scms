<?php

use App\Http\Controllers\Dashboard\Chat\ChatController;
use App\Http\Controllers\Dashboard\Chat\ChatUserController;
use App\Http\Controllers\Dashboard\Course\BatchController;
use App\Http\Controllers\Dashboard\Course\CourseController;
use App\Http\Controllers\Dashboard\Course\ModuleController;
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
    Route::put('dashboard/reservations/{reservation}/approve', [ReservationController::class, 'approve'])->name('reservations.approve');
    Route::put('dashboard/reservations/{reservation}/reject', [ReservationController::class, 'reject'])->name('reservations.reject');
    Route::put('dashboard/reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::delete('dashboard/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

    // Chat
    Route::get('dashboard/chats', [ChatController::class, 'index'])->name('chats.index');
    Route::post('dashboard/chats', [ChatController::class, 'store'])->name('chats.store');
    Route::get('dashboard/chats/{chat}', [ChatController::class, 'show'])->name('chats.show');
    Route::get('dashboard/chats/{chat}/data', [ChatController::class, 'getChatData'])->name('chats.data');
    Route::post('dashboard/chats/{chat}/messages', [ChatController::class, 'sendMessage']);
    Route::post('dashboard/chats/{chat}/files', [ChatController::class, 'uploadFile']);
    Route::get('dashboard/chats/batches/{courseId}', [ChatController::class, 'getBatches']);
    Route::get('dashboard/chats/modules/{courseId}', [ChatController::class, 'getModules']);

    Route::delete('dashboard/chats/{chat}/messages/{message}', [ChatController::class, 'deleteMessage']);
    Route::delete('dashboard/chats/{chat}/files/{file}', [ChatController::class, 'deleteFile']);

    Route::post('dashboard/chats/{chat}/users', [ChatUserController::class, 'addUserToChat']);
    Route::delete('dashboard/chats/{chat}/users/{user}', [ChatUserController::class, 'removeUserFromChat']);

    // Courses
    Route::get('dashboard/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('dashboard/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::post('dashboard/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::delete('dashboard/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');

    Route::post('dashboard/courses/{course}/students', [CourseController::class, 'assignStudents']);
    Route::get('dashboard/courses/{course}/batches', [CourseController::class, 'getBatches']);
    Route::get('dashboard/courses/{course}/students', [CourseController::class, 'getAssignedStudents']);

    // Batches
    Route::get('dashboard/batches', [BatchController::class, 'index'])->name('batches.index');
    Route::get('dashboard/batches/create', [BatchController::class, 'create'])->name('batches.create');
    Route::post('dashboard/batches', [BatchController::class, 'store'])->name('batches.store');
    Route::delete('dashboard/batches/{batch}', [BatchController::class, 'destroy'])->name('batches.destroy');

    // Modules
    Route::get('dashboard/modules', [ModuleController::class, 'index'])->name('modules.index');
    Route::get('dashboard/modules/create', [ModuleController::class, 'create'])->name('modules.create');
    Route::post('dashboard/modules', [ModuleController::class, 'store'])->name('modules.store');
    Route::delete('dashboard/modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');

    Route::post('dashboard/modules/{module}/students', [ModuleController::class, 'assignStudents']);
    Route::post('dashboard/modules/{module}/lecturers', [ModuleController::class, 'assignLecturers']);
    Route::get('dashboard/modules/{module}/students', [ModuleController::class, 'getAssignedStudents']);
    Route::get('dashboard/modules/{module}/lecturers', [ModuleController::class, 'getAssignedLecturers']);

    Route::post('/dashboard/modules/{module}/courses', [ModuleController::class, 'assignCourses']);
    Route::get('/dashboard/modules/{module}/courses', [ModuleController::class, 'getAssignedCourses']);
    
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
