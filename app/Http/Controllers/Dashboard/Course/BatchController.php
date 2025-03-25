<?php

namespace App\Http\Controllers\Dashboard\Course;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index()
    {
        $courses = Course::all();
        $batches = Batch::with('course')->get();
        return Inertia::render('dashboard/batches/index', ['batches' => $batches, 'courses' => $courses]);
    }

    public function create()
    {
        $courses = Course::all();
        return Inertia::render('dashboard/batches/create', ['courses' => $courses]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'code' => 'required|string|max:255|unique:batches',
        ]);

        Batch::create($request->all());

        return redirect()->route('batches.index')->with('success', 'Batch created successfully');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();
        return redirect()->route('batches.index')->with('success', 'Batch deleted successfully');
    }
}
