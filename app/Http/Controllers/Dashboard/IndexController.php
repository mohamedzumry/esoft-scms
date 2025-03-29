<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\LecturerModule;
use App\Models\StudentCourse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->role;

        $role = match ($role) {
            Role::Admin->value => 'admin',
            Role::ITStaff->value => 'it_staff',
            Role::Lecturer->value => 'lecturer',
            default => 'student',
        };

        if ($role === 'student') {
            // Data for Student Dashboard
            $enrolledCourses = StudentCourse::where('student_id', $user->id)
                ->with('course')
                ->get()
                ->map(function ($studentCourse) {
                    return [
                        'id' => $studentCourse->course->id,
                        'title' => $studentCourse->course->name,
                        'instructor' => $studentCourse->course->lecturer ? $studentCourse->course->lecturer->name : 'TBD',
                        'enrollments' => StudentCourse::where('course_id', $studentCourse->course->id)->count(),
                    ];
                });

            return Inertia::render("dashboard/index/student", [
                'enrolledCourses' => $enrolledCourses,
                'totalCourses' => $enrolledCourses->count(),
            ]);
        } elseif ($role === 'lecturer') {
            // Data for Lecturer Dashboard
            $assignedCourses = LecturerModule::where('lecturer_id', $user->id)
                ->with('course')
                ->get()
                ->map(function ($lecturerModule) {
                    return [
                        'id' => $lecturerModule->course->id,
                        'title' => $lecturerModule->course->name,
                        'instructor' => Auth::user()->name,
                        'enrollments' => StudentCourse::where('course_id', $lecturerModule->course->id)->count(),
                    ];
                });

            return Inertia::render("dashboard/index/lecturer", [
                'assignedCourses' => $assignedCourses,
                'totalCourses' => $assignedCourses->count(),
                'totalStudents' => StudentCourse::whereIn('course_id', $assignedCourses->pluck('id'))->count(),
            ]);
        } elseif ($role === 'it_staff') {
            // Data for IT Staff Dashboard
            $totalCourses = Course::count();
            $newCourses = Course::where('created_at', '>=', now()->subMonth())->count();
            $totalStudents = User::where('role', Role::Student->value)->count();
            $pendingStudents = User::where('role', Role::Student->value)
                ->where('status', 'pending')
                ->count();
            $totalLecturers = User::where('role', Role::Lecturer->value)->count();

            return Inertia::render("dashboard/index/it-staff", [
                'courses' => [
                    'total' => $totalCourses,
                    'new' => $newCourses,
                ],
                'students' => [
                    'active' => $totalStudents - $pendingStudents,
                    'pending' => $pendingStudents,
                ],
                'lecturers' => [
                    'total' => $totalLecturers,
                    'available' => User::where('role', Role::Lecturer->value)
                        ->whereDoesntHave('lecturerModules')
                        ->count(),
                ],
            ]);
        } elseif ($role === 'admin') {
            // Data for Admin Dashboard
            $totalCourses = Course::count();
            $newCourses = Course::where('created_at', '>=', now()->subMonth())->count();
            $totalStudents = User::where('role', Role::Student->value)->count();
            $pendingStudents = User::where('role', Role::Student->value)
                ->where('status', 'pending')
                ->count();
            $totalLecturers = User::where('role', Role::Lecturer->value)->count();
            $recentCourses = Course::orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->name,
                        'instructor' => $course->lecturer ? $course->lecturer->name : 'TBD',
                        'enrollments' => StudentCourse::where('course_id', $course->id)->count(),
                    ];
                });

            return Inertia::render("dashboard/index/admin", [
                'courses' => [
                    'total' => $totalCourses,
                    'new' => $newCourses,
                ],
                'students' => [
                    'active' => $totalStudents - $pendingStudents,
                    'pending' => $pendingStudents,
                ],
                'lecturers' => [
                    'total' => $totalLecturers,
                    'available' => User::where('role', Role::Lecturer->value)
                        ->whereDoesntHave('lecturerModules')
                        ->count(),
                ],
                'recentCourses' => $recentCourses,
            ]);
        }
    }
}