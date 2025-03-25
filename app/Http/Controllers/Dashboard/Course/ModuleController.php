<?php

namespace App\Http\Controllers\Dashboard\Course;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Course;
use App\Models\LecturerModule;
use App\Models\Module;
use App\Models\StudentCourse;
use App\Models\StudentCourseModule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/modules/index', [
            'modules' => Module::with('courses')->get()->map(function ($module) {
                return [
                    'id' => $module->id,
                    'name' => $module->name,
                    'description' => $module->description,
                    'is_active' => $module->is_active,
                    'course_id' => $module->courses->first() ? $module->courses->first()->id : null,
                ];
            }),
            'students' => User::where('role', 'student')->get(['id', 'name']),
            'lecturers' => User::where('role', 'lecturer')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/modules/create', [
            'courses' => Course::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $module = Module::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('modules.index')->with('success', 'Module created successfully');
    }

    public function destroy(Module $module)
    {
        $module->delete();
        return redirect()->route('modules.index')->with('success', 'Module deleted successfully');
    }

    public function assignStudents(Request $request, Module $module)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        $course = $module->courses->first();
        if (!$course) {
            return response()->json(['error' => 'Module is not associated with any course'], 400);
        }

        $studentIds = $request->student_ids;
        $studentCourses = StudentCourse::whereIn('student_id', $studentIds)
            ->where('course_id', $course->id)
            ->get();

        foreach ($studentCourses as $studentCourse) {
            StudentCourseModule::firstOrCreate([
                'student_course_id' => $studentCourse->id,
                'module_id' => $module->id,
            ]);
        }

        return response()->json(['success' => 'Students assigned to module successfully']);
    }

    public function assignLecturers(Request $request, Module $module)
    {
        $request->validate([
            'lecturer_ids' => 'required|array',
            'lecturer_ids.*' => 'exists:users,id',
            'batch_id' => 'required|exists:batches,id',
        ]);

        $course = $module->courses->first();
        if (!$course) {
            return response()->json(['error' => 'Module is not associated with any course'], 400);
        }

        $batchId = $request->batch_id;
        if (!$course->batches()->where('batches.id', $batchId)->exists()) {
            return response()->json(['error' => 'Batch does not belong to this course'], 400);
        }

        $lecturerIds = $request->lecturer_ids;
        foreach ($lecturerIds as $lecturerId) {
            LecturerModule::firstOrCreate([
                'lecturer_id' => $lecturerId,
                'course_id' => $course->id,
                'batch_id' => $batchId,
                'module_id' => $module->id,
            ]);
        }

        return response()->json(['success' => 'Lecturers assigned to module successfully']);
    }

    public function getAssignedStudents(Module $module)
    {
        $course = $module->courses->first();
        if (!$course) {
            return response()->json(['error' => 'Module is not associated with any course'], 400);
        }

        $studentCourses = StudentCourse::where('course_id', $course->id)
            ->whereHas('modules', function ($query) use ($module) {
                $query->where('module_id', $module->id);
            })
            ->pluck('student_id');

        return response()->json($studentCourses);
    }

    public function getAssignedLecturers(Module $module, Request $request)
    {
        $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);

        $batchId = $request->batch_id;

        $assignedLecturers = LecturerModule::where('module_id', $module->id)
            ->where('batch_id', $batchId)
            ->pluck('lecturer_id');

        return response()->json($assignedLecturers);
    }
}
