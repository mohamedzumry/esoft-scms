<?php

namespace App\Http\Controllers\Dashboard\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();
        return Inertia::render('dashboard/courses/index', ['courses' => $courses]);
    }

    public function create()
    {
        return Inertia::render('dashboard/courses/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:courses',
            'description' => 'nullable|string',
            'code' => 'nullable|string|max:255|unique:courses',
            'is_active' => 'boolean',
        ]);

        Course::create($request->all());

        return redirect()->route('courses.index')->with('success', 'Course created successfully');
    }

    public function destroy(Course $course)
{
    $course->delete();
    return redirect()->route('courses.index')->with('success', 'Course deleted successfully');
}
}
