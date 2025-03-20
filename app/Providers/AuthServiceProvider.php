<?php

namespace App\Providers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('create-user', function (User $user, Role $role) {
            if ($user->role === 'admin') {
                return true;
            } elseif ($user->role === 'it_staff') {
                return !in_array($role, ['admin', 'it_staff']);
            }
            return false;
        });
    }
}
