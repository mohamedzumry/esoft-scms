<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_category_id',
        'title',
        'date',
        'time',
        'venue',
        'target_audience',
        'event_image',
        'description',
        'registration_link',
        'created_by',
    ];

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }
}
