<?php

namespace App\Http\Controllers\Dashboard\Chat;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;

class ChatUserController extends Controller
{
    public function addUserToChat(Request $request, Chat $chat)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $userId = $request->user_id;

        if ($chat->users()->where('user_id', $userId)->exists()) {
            return response()->json(['error' => 'User is already in the chat'], 400);
        }

        $chat->users()->attach($userId);

        return response()->json(['success' => 'User added to chat successfully']);
    }

    public function removeUserFromChat(Request $request, Chat $chat, User $user)
    {
        if (!$chat->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'User is not in the chat'], 400);
        }

        $chat->users()->detach($user->id);

        return response()->json(['success' => 'User removed from chat successfully']);
    }
}
