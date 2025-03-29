<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, $id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return redirect()->back();
    }

    public function markAllAsRead(Request $request)
    {
        Auth::user()->unreadNotifications->markAsRead();

        return redirect()->back();
    }
}