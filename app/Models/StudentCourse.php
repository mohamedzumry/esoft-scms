<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudentCourse extends Model
{
    protected $fillable = ['student_id', 'course_id', 'batch_id'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'student_course_modules', 'student_course_id', 'module_id')
                    ->withTimestamps();
    }
}
