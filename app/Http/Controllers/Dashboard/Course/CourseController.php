<?php

namespace App\Http\Controllers\Dashboard\Course;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Course;
use App\Models\StudentCourse;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/courses/index', [
            'courses' => Course::all(),
            'students' => User::where('role', 'student')->get(['id', 'name']),
            'batches' => Batch::all(['id', 'code']),
        ]);
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

    public function assignStudents(Request $request, Course $course)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id',
            'batch_id' => 'required|exists:batches,id',
        ]);

        $studentIds = $request->student_ids;
        $batchId = $request->batch_id;

        if (!$course->batches()->where('batches.id', $batchId)->exists()) {
            return response()->json(['error' => 'Batch does not belong to this course'], 400);
        }

        foreach ($studentIds as $studentId) {
            StudentCourse::firstOrCreate([
                'student_id' => $studentId,
                'course_id' => $course->id,
                'batch_id' => $batchId,
            ]);
        }

        return response()->json(['success' => 'Students assigned successfully']);
    }

    public function getAssignedStudents(Course $course, Request $request)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);

        $batchId = $request->batch_id;

        $assignedStudents = StudentCourse::where('course_id', $course->id)
            ->where('batch_id', $batchId)
            ->pluck('student_id');

        return response()->json($assignedStudents);
    }

    public function getBatches(Course $course)
    {
        $batches = $course->batches()->get(['id', 'code']);
        return response()->json($batches);
    }
}
