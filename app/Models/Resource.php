<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'capacity',
    ];

    protected $casts = [
        'capacity' => 'integer',
    ];
}
