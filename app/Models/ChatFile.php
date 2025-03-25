<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatFile extends Model
{
    protected $fillable = ['chat_id', 'uploaded_by_id', 'file_name', 'path'];

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by_id');
    }
}