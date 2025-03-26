<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chat extends Model
{
    protected $guarded = []; // Allow mass assignment for simplicity

    protected $fillable = ['chat_name', 'creator_id', 'course_id', 'batch_id', 'module_id'];

    public function creator(): BelongsTo
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

    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_users', 'chat_id', 'user_id')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    public function files()
    {
        return $this->hasMany(ChatFile::class);
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }
}
