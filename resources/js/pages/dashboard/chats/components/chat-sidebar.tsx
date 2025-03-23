import { Button } from "@/components/ui/button";
import { PageProps } from "@inertiajs/core";
import { usePage } from "@inertiajs/react";

interface ChatSidebarProps extends PageProps {
    chats: Array<{ id: number; name: string }>;
    onSelectChat: (chatId: number) => void;
    onCreateChat: () => void;
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

export default function ChatSidebar({ chats, onSelectChat, onCreateChat, selectedChatId, auth }: ChatSidebarProps) {
    // Get user data from Inertia page props
    // const { auth } = usePage<ChatSidebarProps>().props;
    const user = auth?.user;

    return (
        <div className="w-64 border-r p-4 flex flex-col h-full">
            <div className="space-y-2">
                {chats.map((chat) => (
                    <Button
                        key={chat.id}
                        variant={selectedChatId === chat.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onSelectChat(chat.id)}
                    >
                        {chat.name}
                    </Button>
                ))}
            </div>
            {user?.role === 'it_staff' || user?.role === '' && (
                <div className="mt-auto">
                    <Button className="w-full" onClick={onCreateChat}>
                        Create New Chat
                    </Button>
                </div>
            )}
        </div>
    );
}