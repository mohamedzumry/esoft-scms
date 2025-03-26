<?php

namespace App\Http\Controllers\Dashboard\Chat;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Chat;
use App\Models\ChatFile;
use App\Models\Course;
use App\Models\LecturerModule;
use App\Models\Module;
use App\Models\StudentCourse;
use App\Models\StudentCourseModule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $query = Chat::select(['id', 'chat_name', 'creator_id', 'course_id', 'batch_id', 'module_id'])
            ->with([
                'course' => fn($q) => $q->select(['id', 'name']),
                'batch' => fn($q) => $q->select(['id', 'code']),
                'module' => fn($q) => $q->select(['id', 'name']),
                'creator' => fn($q) => $q->select(['id', 'name']),
            ]);

        if (!in_array($user->role, ['admin', 'it_staff'])) {
            $query->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            });
        }

        $chats = $query->get()->map(function ($chat) use ($user) {
            return [
                'id' => $chat->id,
                'chat_name' => $chat->chat_name,
                'course' => $chat->course ? $chat->course->name : null,
                'batch' => $chat->batch ? $chat->batch->code : null,
                'module' => $chat->module ? $chat->module->name : null,
                'creator' => $chat->creator ? $chat->creator->name : null,
                'can_delete' => $this->canDeleteChat($chat, $user),
            ];
        });

        $courses = $user->role === 'admin' || $user->role === 'it_staff'
            ? Course::all(['id', 'name'])
            : Course::whereIn('id', $user->lecturerModules()->pluck('course_id'))->get(['id', 'name']);

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

        // Validate lecturer assignment if a module is selected
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

        // Create the chat
        $chat = Chat::create([
            'chat_name' => $request->chat_name,
            'creator_id' => $user->id,
            'course_id' => $request->course_id,
            'batch_id' => $request->batch_id,
            'module_id' => $request->module_id,
        ]);

        // Attach users to the chat based on the conditions
        if ($request->module_id) {
            // Case 1: Module is selected
            // Fetch student_course_ids for the given course and batch
            $studentCourseIds = StudentCourse::where('course_id', $request->course_id)
                ->where('batch_id', $request->batch_id) // Assuming batch_id is in student_courses
                ->pluck('id');

            // Fetch students assigned to the module via student_course_modules
            $studentIds = StudentCourseModule::whereIn('student_course_id', $studentCourseIds)
                ->where('module_id', $request->module_id)
                ->with('studentCourse.student') // Eager load the student
                ->get()
                ->pluck('studentCourse.student.id')
                ->unique()
                ->values()
                ->toArray();

            // Fetch lecturers assigned to the course, batch, and module
            $lecturerIds = LecturerModule::where('course_id', $request->course_id)
                ->where('batch_id', $request->batch_id)
                ->where('module_id', $request->module_id)
                ->pluck('lecturer_id')
                ->toArray();

            // Combine student and lecturer IDs
            $userIds = array_merge($studentIds, $lecturerIds);
            $userIds = array_unique($userIds);
        } else {
            // Case 2: No module is selected
            // Attach all students enrolled in the course and batch
            $userIds = StudentCourse::where('course_id', $request->course_id)
                ->where('batch_id', $request->batch_id) // Assuming batch_id is in student_courses
                ->pluck('student_id')
                ->toArray();
        }

        // Attach the creator to the chat (if not already included)
        if (!in_array($user->id, $userIds)) {
            $userIds[] = $user->id;
        }

        // Attach all users to the chat
        $chat->users()->sync($userIds);

        return redirect()->route('chats.index')->with('success', 'Chat created successfully');
    }

    public function show(Chat $chat)
    {
        $user = Auth::user();

        // Check if the user has access to the chat
        $hasAccess = $user->role === 'admin' || $user->role === 'it_staff' || $chat->users()->where('users.id', $user->id)->exists();
        if (!$hasAccess) {
            return redirect()->route('chats.index')->with('error', 'Unauthorized to view this chat');
        }

        // Load relationships
        $chat->load('course', 'batch', 'module', 'messages.user', 'files.uploaded_by', 'creator');

        return Inertia::render('Chats/Show', [
            'chat' => $chat,
            'messages' => $chat->messages->with('user')->latest()->get(),
            'chats' => Chat::whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
        ]);
    }

    public function destroy(Chat $chat)
    {
        $user = Auth::user();

        // Check if the user is authorized to delete the chat
        if (!$this->canDeleteChat($chat, $user)) {
            return response()->json(['error' => 'Unauthorized to delete this chat'], 403);
        }

        $chat->delete();

        return redirect()->route('chats.index')->with('success', 'Chat deleted successfully');
    }

    public function getChatData(Chat $chat)
    {
        $chat->load(['course', 'batch', 'module', 'files.uploadedBy', 'creator']);
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

        ChatFile::create([
            'chat_id' => $chatId,
            'uploaded_by_id' => Auth::id(),
            'file_name' => $file->getClientOriginalName(),
            'path' => $path,
        ]);

        return redirect()->route('chats.index', $chatId);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        try {
            $user = Auth::user();
            // if (!$this->canSend($user, $chat)) {
            //     throw new \Exception("You are not authorized to send messages in this chat.");
            // }

            $request->validate(['message' => 'required|string|max:5000']);
            $message = $chat->messages()->create(['user_id' => $user->id, 'message' => $request->message]);
            return redirect()->route('chats.index', $chat->id);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function getBatches($courseId)
    {
        $batches = Batch::where('course_id', $courseId)->get();
        return response()->json(['batches' => $batches]);
    }

    public function getModules($courseId)
    {
        $user = Auth::user();
        $modules = ($user->role === 'admin' || $user->role === 'it_staff')
            ? Module::where('course_id', $courseId)->get()
            : Module::whereIn('id', $user->lecturerModules()->where('course_id', $courseId)->pluck('module_id'))->get();
        return response()->json(['modules' => $modules]);
    }

    public function deleteMessage(Chat $chat, $messageId)
    {
        $user = Auth::user();
        $message = $chat->messages()->findOrFail($messageId);

        $canDelete = (
            $message->user_id === $user->id ||
            $chat->creator_id === $user->id ||
            in_array($user->role, ['admin', 'it_staff'])
        );

        if (!$canDelete) {
            return back()->with('error', 'You are not authorized to delete this message.');
        }

        if ($message->chat_id !== $chat->id) {
            return back()->with('error', 'Message does not belong to this chat.');
        }

        $message->delete();

        return back()->with('success', 'Message deleted successfully');
    }

    public function deleteFile(Chat $chat, $fileId)
    {
        $user = Auth::user();
        $file = $chat->files()->findOrFail($fileId);

        if ($chat->creator_id !== $user->id || !in_array($user->role, ['admin', 'it_staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($file->chat_id !== $chat->id) {
            return response()->json(['error' => 'File does not belong to this chat'], 403);
        }

        Storage::disk('public')->delete($file->path);
        $file->delete();

        return redirect()->route('chats.index', $chat->id);
    }

    private function canDeleteChat(Chat $chat, User $user): bool
    {
        return $chat->creator_id === $user->id || in_array($user->role, ['admin', 'it_staff']);
    }

    public function getMembers(Chat $chat)
    {
        $user = Auth::user();

        $hasAccess = in_array($user->role, ['admin', 'it_staff']) || $chat->users()->where('users.id', $user->id)->exists();

        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized to view members of this chat'], 403);
        }

        $members = $chat->users()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ];
        });

        return response()->json([
            'chat_name' => $chat->chat_name,
            'members' => $members,
        ]);
    }
}
