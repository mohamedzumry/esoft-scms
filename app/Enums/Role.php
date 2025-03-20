<?php

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case ITStaff = 'it_staff';
    case Student = 'student';
    case Lecturer = 'lecturer';

    /**
     * Get all roles as an array.
     *
     * @return array<string>
     */
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }
}