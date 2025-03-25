<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $fillable = ['course_id', 'code'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class);
    }

    public function lecturerModules()
    {
        return $this->hasMany(LecturerModule::class);
    }
}
