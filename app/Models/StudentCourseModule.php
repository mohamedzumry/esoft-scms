<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentCourseModule extends Model
{
    protected $fillable = ['student_course_id', 'module_id', 'completed'];

    public function studentCourse()
    {
        return $this->belongsTo(StudentCourse::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
