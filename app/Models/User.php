<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'nick_name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all reservations made by this user.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'reserved_by');
    }

    /**
     * Validate if the user has a specific role.
     *
     * @param Role $role
     * @return bool
     */
    public function hasRole(Role $role): bool
    {
        return $this->role === $role->value;
    }

    /**
     * Assign a role to the user.
     *
     * @param Role $role
     * @return void
     */
    public function assignRole(Role $role): void
    {
        $this->role = $role->value;
        $this->save();
    }

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_users', 'user_id', 'chat_id')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class, 'student_id');
    }

    public function lecturerModules()
    {
        return $this->hasMany(LecturerModule::class, 'lecturer_id');
    }

    protected static function booted()
    {
        static::addGlobalScope('selectColumns', function (Builder $builder) {
            $builder->select(['users.id', 'users.name', 'users.role', 'users.email', 'users.nick_name', 'users.password']);
        });
    }
}
