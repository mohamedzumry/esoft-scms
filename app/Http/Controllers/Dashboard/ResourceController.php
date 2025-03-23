<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\ResourceCategory;
use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use ReflectionClass;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Use ReflectionClass to get constants from the enum
        $reflection = new ReflectionClass(ResourceCategory::class);
        $categories = [];

        foreach ($reflection->getConstants() as $key => $value) {
            $categories[] = [
                'value' => $value,
                'label' => ucfirst($value),
            ];
        }
        $resources = Resource::all();

        return Inertia::render('dashboard/resource/index', [
            'resources' => $resources,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'nullable|integer',
        ]);

        Resource::create($validated);

        return redirect()->route('resources.index')->with('success', 'Resource created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();

        return redirect()->route('resources.index')->with('success', 'Resource deleted successfully.');
    }
}
