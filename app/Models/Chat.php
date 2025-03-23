<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $guarded = []; // Allow mass assignment for simplicity

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }
}
