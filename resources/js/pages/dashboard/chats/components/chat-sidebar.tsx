import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageProps } from '@inertiajs/core';
import { MoreVertical } from 'lucide-react'; // Three-dot icon

interface Chat {
    id: number;
    chat_name: string;
    creator?: { id: number; name: string; role: string; email: string; nick_name: string };
    course: { id: number; name: string };
    batch: { id: number; code: string };
    module?: { id: number; name: string } | null;
    can_delete: boolean;
}

interface ChatSidebarProps extends PageProps {
    chats: Chat[];
    onSelectChat: (chatId: number) => void;
    onCreateChat: () => void;
    onDeleteChat: (chat: Chat) => void;
    onViewMembers: (chat: Chat) => void; // Add onViewMembers prop
    selectedChatId: number | null;
    deletingId: number | null;
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

export default function ChatSidebar({
    chats,
    onSelectChat,
    onCreateChat,
    onDeleteChat,
    onViewMembers,
    selectedChatId,
    deletingId,
    auth,
}: ChatSidebarProps) {
    const user = auth?.user;

    return (
        <div className="flex h-full w-64 flex-col overflow-y-auto border-r p-4">
            <div className="space-y-2">
                {chats.map((chat) => (
                    <div key={chat.id} className="flex items-center justify-between">
                        <Button
                            variant={selectedChatId === chat.id ? 'secondary' : 'ghost'}
                            className="flex-1 justify-start truncate"
                            onClick={() => onSelectChat(chat.id)}
                            disabled={deletingId === chat.id}
                        >
                            {chat.chat_name}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" disabled={deletingId === chat.id}>
                                    {deletingId === chat.id ? <span className="h-4 w-4 animate-spin">⏳</span> : <MoreVertical className="h-4 w-4" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onViewMembers(chat)}>View Members</DropdownMenuItem>
                                {chat.can_delete && (
                                    <DropdownMenuItem onClick={() => onDeleteChat(chat)} className="text-red-600">
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
            {(user?.role === 'it_staff' || user?.role === 'lecturer' || user?.role === 'admin') && (
                <div className="mt-auto">
                    <Button className="w-full" onClick={onCreateChat}>
                        Create New Chat
                    </Button>
                </div>
            )}
        </div>
    );
}
