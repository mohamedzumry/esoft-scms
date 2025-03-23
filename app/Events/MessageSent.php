<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $message;

    public function __construct(ChatMessage $message)
    {
        $this->message = $message->load('user'); // Include user data
    }

    public function broadcastOn()
    {
        return new Channel('chat.' . $this->message->chat_id);
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
        ];
    }
}