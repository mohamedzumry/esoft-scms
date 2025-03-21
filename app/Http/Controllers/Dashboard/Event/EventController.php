<?php

namespace App\Http\Controllers\Dashboard\Event;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = EventCategory::all();
        $upcomingEvents = Event::where('date', '>=', now())->orderBy('date')->get();
        $pastEvents = Event::where('date', '<', now())->orderByDesc('date')->get();
        return Inertia::render('dashboard/event/index', [
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
            'categories' => $categories
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
            'event_category_id' => 'required|exists:event_categories,id',
            'title' => 'required|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'venue' => 'required|max:255',
            'target_audience' => 'required|max:255',
            'event_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'required',
            'registration_link' => 'nullable|url',
        ]);

        if ($request->hasFile('event_image')) {
            $path = $request->file('event_image')->store('event_images', 'public');
            $validated['event_image'] = $path;
        }

        Event::create($validated);
        return redirect()->route('events.index')->with('success', 'Event created successfully.');
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
        //
    }
}
