<?php

namespace App\Http\Controllers\Dashboard\Course;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::all();
        return Inertia::render('dashboard/modules/index', ['modules' => $modules]);
    }

    public function create()
    {
        return Inertia::render('dashboard/modules/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Module::create($request->all());

        return redirect()->route('modules.index')->with('success', 'Module created successfully');
    }

    public function destroy(Module $module)
{
    $module->delete();
    return redirect()->route('modules.index')->with('success', 'Module deleted successfully');
}
}
