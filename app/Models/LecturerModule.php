<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LecturerModule extends Model
{
    protected $fillable = ['lecturer_id', 'course_id', 'batch_id', 'module_id'];

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
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
}
