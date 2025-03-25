<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = ['name', 'description', 'code', 'is_active'];

    // public function batches()
    // {
    //     return $this->hasMany(Batch::class);
    // }

    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class);
    }

    public function lecturerModules()
    {
        return $this->hasMany(LecturerModule::class);
    }

    /**
     * Get the batches associated with this course.
     */
    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class, 'course_id');
    }

    /**
     * Get the modules associated with this course.
     */
    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'course_modules', 'course_id', 'module_id')
            ->withTimestamps()
            ->using(CourseModule::class);
    }
}
