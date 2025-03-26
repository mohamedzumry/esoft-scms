<?php

namespace App\Http\Controllers\Dashboard;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {

        $user = Auth::user();

        $availableRoles = match ($user->role) {
            Role::Admin->value => Role::toArray(),
            Role::ITStaff->value => Collection::make(Role::toArray())
                ->reject(fn($role) => in_array($role, [Role::Admin->value, Role::ITStaff->value]))
                ->values()
                ->toArray(),
            default => [],
        };

        $users = User::paginate(10);
        return Inertia::render('dashboard/users', [
            'users' => $users,
            'availableRoles' => $availableRoles,
        ]);
    }
}
