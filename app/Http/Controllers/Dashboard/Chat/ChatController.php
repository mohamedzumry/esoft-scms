<?php

namespace App\Http\Controllers\Dashboard\Chat;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Chat;
use App\Models\ChatFile;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $chats = $user->role === 'admin' || $user->role === 'it_staff'
            ? Chat::with(['course', 'batch', 'module'])->get()
            : Chat::whereIn('course_id', $user->lecturerModules()->pluck('course_id'))
            ->whereIn('batch_id', $user->lecturerModules()->pluck('batch_id'))
            ->where(function ($query) use ($user) {
                $query->whereNull('module_id')
                    ->orWhereIn('module_id', $user->lecturerModules()->pluck('module_id'));
            })
            ->with(['course', 'batch', 'module'])
            ->get();

        $courses = $user->role === 'admin' || $user->role === 'it_staff'
            ? Course::all()
            : Course::whereIn('id', $user->lecturerModules()->pluck('course_id'))->get();

        return Inertia::render('dashboard/chats/index', [
            'chats' => $chats,
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'chat_name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'batch_id' => 'required|exists:batches,id',
            'module_id' => 'nullable|exists:modules,id',
        ]);

        if ($user->role === 'lecturer' && $request->module_id) {
            $assigned = $user->lecturerModules()
                ->where('course_id', $request->course_id)
                ->where('batch_id', $request->batch_id)
                ->where('module_id', $request->module_id)
                ->exists();
            if (!$assigned) {
                return back()->withErrors(['module_id' => 'You are not assigned to this module.']);
            }
        }

        $chat = Chat::create([
            'chat_name' => $request->chat_name,
            'creator_id' => $user->id,
            'course_id' => $request->course_id,
            'batch_id' => $request->batch_id,
            'module_id' => $request->module_id,
        ]);

        return redirect()->route('chats.index')->with('success', 'Chat created successfully');
    }

    public function show(Chat $chat)
    {
        $user = Auth::user();
        $chat->load(['course', 'batch', 'module', 'files.uploadedBy']);
        $messages = $chat->messages()->with('user')->latest()->get();

        $chats = $user->role === 'admin' || $user->role === 'it_staff'
            ? Chat::with(['course', 'batch', 'module'])->get()
            : Chat::whereIn('course_id', $user->lecturerModules()->pluck('course_id'))
            ->whereIn('batch_id', $user->lecturerModules()->pluck('batch_id'))
            ->where(function ($query) use ($user) {
                $query->whereNull('module_id')
                    ->orWhereIn('module_id', $user->lecturerModules()->pluck('module_id'));
            })
            ->with(['course', 'batch', 'module'])
            ->get();

        $courses = $user->role === 'admin' || $user->role === 'it_staff'
            ? Course::all()
            : Course::whereIn('id', $user->lecturerModules()->pluck('course_id'))->get();

        return Inertia::render('dashboard/chats/index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'role' => $user->role,
                ],
            ],
            'chat' => $chat,
            'messages' => $messages,
            'chats' => $chats,
            'courses' => $courses,
        ]);
    }

    public function getChatData(Chat $chat)
    {
        $chat->load(['course', 'batch', 'module', 'files.uploadedBy']);
        $messages = $chat->messages()->with('user')->latest()->get();

        $transformedFiles = $chat->files->map(function ($file) {
            $url = Storage::url($file->path);
            return [
                'id' => $file->id,
                'name' => $file->file_name,
                'url' => $url,
                'uploaded_by' => [
                    'id' => $file->uploaded_by_id,
                    'name' => $file->uploadedBy->name,
                ],
                'created_at' => $file->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'chat' => array_merge($chat->toArray(), ['files' => $transformedFiles]),
            'messages' => $messages,
        ]);
    }

    public function uploadFile(Request $request, $chatId)
    {
        $request->validate(['file' => 'required|file|max:10240']); // 10MB max
        $file = $request->file('file');
        $path = $file->store('chat_files', 'public');

        $chatFile = ChatFile::create([
            'chat_id' => $chatId,
            'uploaded_by_id' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'path' => $path,
        ]);

        return response()->json($chatFile);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        $request->validate(['message' => 'required|string|max:5000']);
        $message = $chat->messages()->create(['user_id' => Auth::id(), 'message' => $request->message]);
        return response()->json(['success' => 'Message sent successfully'], 201);
    }

    public function getBatches($courseId)
    {
        $batches = Batch::where('course_id', $courseId)->get();
        return response()->json(['batches' => $batches]);
    }

    public function getModules($courseId)
    {
        $user = Auth::user();
        $modules = $user->role === 'admin' || $user->role === 'it_staff'
            ? Module::where('course_id', $courseId)->get()
            : Module::whereIn('id', $user->lecturerModules()->where('course_id', $courseId)->pluck('module_id'))->get();
        return response()->json(['modules' => $modules]);
    }

    public function deleteMessage(Chat $chat, $messageId)
    {
        $user = Auth::user();
        $message = $chat->messages()->findOrFail($messageId);

        // Check permissions
        if (!$this->canDelete($user, $chat)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['success' => 'Message deleted successfully']);
    }

    public function deleteFile(Chat $chat, $fileId)
    {
        $user = Auth::user();
        $file = $chat->files()->findOrFail($fileId);

        // Check permissions
        if (!$this->canDelete($user, $chat)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete the file from storage
        Storage::disk('public')->delete($file->path);
        $file->delete();

        return response()->json(['success' => 'File deleted successfully']);
    }

    private function canDelete($user, Chat $chat)
    {
        if (in_array($user->role, ['admin', 'it_staff', 'owner'])) {
            return true;
        }

        if ($user->role === 'lecturer') {
            return $user->lecturerModules()
                ->where('course_id', $chat->course_id)
                ->where('batch_id', $chat->batch_id)
                ->where(function ($query) use ($chat) {
                    $query->whereNull('module_id')
                        ->orWhere('module_id', $chat->module_id);
                })
                ->exists();
        }

        return false;
    }
}
