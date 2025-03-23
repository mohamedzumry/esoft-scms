<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Resource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::with(['user', 'resource'])->get();
        $resources = Resource::all();

        return Inertia::render('dashboard/reservation/index', [
            'reservations' => $reservations,
            'resources' => $resources,
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
        $rules = [
            'resource_id' => 'required|exists:resources,id',
            'start_date_time' => 'required|date|before:end_date_time',
            'end_date_time' => 'required|date|after:start_date_time',
            'purpose' => 'required|string|max:255',
            'description' => 'required|string',
            'course' => 'nullable|string|max:255',
            'batch' => 'nullable|string|max:255',
        ];

        // If the user is a student, make course and batch required
        if (Auth::user()->role === 'student') {
            $rules['course'] = 'required|string|max:255';
            $rules['batch'] = 'required|string|max:255';
        }

        $validated = $request->validate($rules);

        // Check for overlapping approved reservations
        $startDateTime = \Carbon\Carbon::parse($validated['start_date_time']);
        $endDateTime = \Carbon\Carbon::parse($validated['end_date_time']);

        $overlappingReservation = Reservation::where('resource_id', $validated['resource_id'])
            ->where('approval_status', 'approved')
            ->where(function ($query) use ($startDateTime, $endDateTime) {
                $query->where('start_date_time', '<', $endDateTime)
                    ->where('end_date_time', '>', $startDateTime);
            })
            ->exists();

        if ($overlappingReservation) {
            return back()->withErrors(['start_date_time' => 'This resource is already reserved for the selected time period.'])->withInput();
        }

        $user = Auth::user();
        $validated['reserved_by'] = $user->id;
        $validated['approval_status'] = 'pending'; // Default status

        Reservation::create($validated);

        return redirect()->route('reservations.index')->with('success', 'Reservation created successfully.');
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
    public function destroy(Reservation $reservation)
    {
        $this->authorize('delete', $reservation);
        $reservation->delete();
        return back()->with('success', 'Reservation deleted');
    }

    public function approve(Reservation $reservation)
    {
        $this->authorize('update', $reservation); // Ensure only admin/it_staff can approve
        $reservation->update(['approval_status' => 'approved']);
        return back()->with('success', 'Reservation approved');
    }

    public function reject(Reservation $reservation)
    {
        $this->authorize('update', $reservation); // Ensure only admin/it_staff can reject
        $reservation->update(['approval_status' => 'rejected']);
        return back()->with('success', 'Reservation rejected');
    }

    public function cancel(Reservation $reservation)
    {
        $this->authorize('cancel', $reservation); // Custom policy for admin/it_staff or creator
        $reservation->update(['approval_status' => 'cancelled']);
        return back()->with('success', 'Reservation cancelled');
    }
}
