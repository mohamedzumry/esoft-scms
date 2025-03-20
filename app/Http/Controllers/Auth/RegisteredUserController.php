<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
{
    // Validate the request
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
        'role' => ['required', 'string', 'in:' . implode(',', Role::toArray())],
    ]);

    $role = Role::tryFrom($request->role);
    if (!$role || !Gate::allows('create-user', $role)) {
        abort(403, 'You are not authorized to assign this role.');
    }

    // Create the user
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'role' => $role->value,
    ]);

    // Dispatch the Registered event and log in the user
    event(new Registered($user));

    return redirect()->route('dashboard.users')->with('success', 'User created successfully');
}


    /**
     * Handle an incoming set password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function setPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'nick_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|exists:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'email.exists' => 'Invalid email, please try again. If the problem persists, please contact your counsellor.',
        ]);

        $user = User::where('email', $request->email)->first();

        // If the user already has a password, redirect to login page with a message
        if ($user->password) {
            return redirect()->route('login')->with('error', 'User already set. Please log in.');
        }


        $user->password = Hash::make($request->password);
        $user->nick_name = $request->nick_name;
        $user->save();

        Auth::login($user);

        return to_route('dashboard');
    }
}
