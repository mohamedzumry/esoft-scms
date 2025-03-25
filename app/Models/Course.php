<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['name', 'description', 'code', 'is_active'];

    public function batches()
    {
        return $this->hasMany(Batch::class);
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