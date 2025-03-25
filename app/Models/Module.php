<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $table = 'modules';

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_modules', 'module_id', 'course_id')
            ->withTimestamps();
    }

    public function studentCourseModules()
    {
        return $this->hasMany(StudentCourseModule::class);
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }
}
