<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'reserved_by',
        'resource_id',
        'start_date_time',
        'end_date_time',
        'purpose',
        'description',
        'course',
        'batch',
        'approval_status',
    ];

    protected $casts = [
        'start_date_time' => 'datetime', // Casts to Carbon instance for date and time
        'end_date_time' => 'datetime', // Casts to Carbon instance for date and time
        'reserved_by' => 'integer',
        'resource_id' => 'integer',
        'is_approved' => 'boolean',
    ];

    /**
     * Get the user who made the reservation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reserved_by');
    }

    /**
     * Get the resource being reserved.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class, 'resource_id');
    }
}
