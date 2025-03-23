<?php

namespace App\Http\Controllers\Dashboard;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $chats = Chat::where('course_id', $request->course_id)
            ->where('batch_id', $request->batch_id)
            ->with(['creator', 'course', 'batch', 'module'])
            ->get();

        return Inertia::render('dashboard/chats/index', [
            'chats' => $chats,
            // 'auth' => $request->user(),
            'filters' => $request->only(['course_id', 'batch_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            'module_id' => 'nullable|exists:modules,id',
        ]);

        $chat = Chat::create([
            'creator_id' => Auth::id(),
            'course_id' => $request->course_id,
            'batch_id' => $request->batch_id,
            'module_id' => $request->module_id,
        ]);

        return redirect()->route('chats.show', $chat->id)
            ->with('success', 'Chat created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Chat $chat)
    {
        $messages = $chat->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'chat' => $chat->load('creator', 'course', 'batch', 'module'),
                'messages' => $messages,
            ]);
        }

        return Inertia::render('dashboard/chats/components/chat-view', [
            'chat' => $chat->load('creator', 'course', 'batch', 'module'),
            'messages' => $messages,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // Send a message in a chat
    public function sendMessage(Request $request, Chat $chat)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $message = $chat->messages()->create([
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        // Broadcast the new message
        broadcast(new MessageSent($message))->toOthers();

        return redirect()->back()->with('success', 'Message sent successfully');
    }
}
