import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef, useState } from 'react';
import MessageInput from './message-input';

// Define TypeScript interfaces
interface Message {
    id: number;
    user: { id: number; name: string };
    message: string;
    created_at: string;
}

interface File {
    id: number;
    name: string;
    url: string;
    uploaded_by: { id: number; name: string };
    created_at: string;
}

interface Chat {
    id: number;
    chat_name: string;
    creator: { id: number; name: string };
    course: { id: number; name: string };
    batch: { id: number; code: string };
    module?: { id: number; name: string } | null;
    files?: File[];
}

interface ChatViewProps {
    chat: Chat;
    messages: Message[];
    auth: { user: { id: number; role: string } };
    refreshChatData?: () => void;
}

// Simple URL detection regex
const urlRegex = /(https?:\/\/[^\s]+)/g;

export default function ChatView({ chat, messages, auth, refreshChatData }: ChatViewProps) {
    const [showFiles, setShowFiles] = useState<boolean>(false);
    const [contextMenu, setContextMenu] = useState<{
        type: 'message' | 'file' | null;
        id: number | null;
        x: number;
        y: number;
    }>({ type: null, id: null, x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Close context menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu({ type: null, id: null, x: 0, y: 0 });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Check if user can delete (admin, it_staff, owner, or lecturer in the chat)
    const canDelete = () => {
        const userRole = auth.user.role;
        if (['admin', 'it_staff', 'owner'].includes(userRole)) return true;
        if (userRole === 'lecturer') {
            const lecturerCourses = chat.course?.id ? [chat.course.id] : [];
            const lecturerBatches = chat.batch?.id ? [chat.batch.id] : [];
            const lecturerModules = chat.module?.id ? [chat.module.id] : [];
            return (
                lecturerCourses.includes(chat.course?.id) &&
                lecturerBatches.includes(chat.batch?.id) &&
                (chat.module ? lecturerModules.includes(chat.module.id) : true)
            );
        }
        return false;
    };

    const handleRightClick = (event: React.MouseEvent, type: 'message' | 'file', id: number) => {
        event.preventDefault();
        if (!canDelete()) return;
        setContextMenu({
            type,
            id,
            x: event.clientX,
            y: event.clientY,
        });
    };

    const handleDelete = async () => {
        if (!contextMenu.type || !contextMenu.id) return;

        const endpoint =
            contextMenu.type === 'message'
                ? `/dashboard/chats/${chat.id}/messages/${contextMenu.id}`
                : `/dashboard/chats/${chat.id}/files/${contextMenu.id}`;

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) throw new Error(`Failed to delete ${contextMenu.type}`);

            refreshChatData?.();
        } catch (error) {
            console.error(`Error deleting ${contextMenu.type}:`, error);
        } finally {
            setContextMenu({ type: null, id: null, x: 0, y: 0 });
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-gray-100">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b bg-white p-4">
                <div>
                    <h2 className="text-lg font-semibold">{chat.chat_name}</h2>
                    <p className="text-sm text-gray-500">
                        {chat.course?.name || 'Unknown Course'} - {chat.batch?.code || 'Unknown Batch'}
                        {chat.module ? ` - ${chat.module.name}` : ''}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowFiles(!showFiles)}>
                    {showFiles ? 'Hide Files' : 'View Files'}
                </Button>
            </div>

            {/* Content Area: Messages or Files */}
            <ScrollArea
                className="flex-grow overflow-y-auto p-4" // Use flex-grow and overflow-y-auto
                style={{ maxHeight: 'calc(100vh - 128px)' }} // Adjust based on header/input heights
            >
                {showFiles ? (
                    chat.files && chat.files.length > 0 ? (
                        <div className="space-y-2">
                            {chat.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between rounded bg-white p-2 shadow"
                                    onContextMenu={(e) => handleRightClick(e, 'file', file.id)}
                                >
                                    <div>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {file.name}
                                        </a>
                                        <p className="text-xs text-gray-500">
                                            Uploaded by {file.uploaded_by.name} at {new Date(file.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No files uploaded yet.</p>
                    )
                ) : messages.length > 0 ? (
                    messages.map((message) => {
                        const isSent = message.user.id === auth.user.id;
                        const urls = message.message.match(urlRegex) || [];
                        const messageWithoutUrls = message.message.replace(urlRegex, '').trim();

                        return (
                            <div
                                key={message.id}
                                className={`mb-4 flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                onContextMenu={(e) => handleRightClick(e, 'message', message.id)}
                            >
                                <div
                                    className={`relative max-w-xs rounded-lg p-3 shadow ${
                                        isSent ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
                                    }`}
                                >
                                    <div
                                        className={`absolute top-0 h-0 w-0 border-t-8 border-b-8 border-transparent ${
                                            isSent ? 'right-[-8px] border-l-8 border-l-green-500' : 'left-[-8px] border-r-8 border-r-white'
                                        }`}
                                    />
                                    {messageWithoutUrls && <p className="text-sm">{messageWithoutUrls}</p>}
                                    {urls.length > 0 && (
                                        <div className="mt-1">
                                            {urls.map((url, index) => (
                                                <a
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-sm text-blue-500 hover:underline"
                                                >
                                                    {url}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    <span className={`mt-1 block text-right text-xs ${isSent ? 'text-gray-200' : 'text-gray-400'}`}>
                                        {new Date(message.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">No messages yet.</p>
                )}
            </ScrollArea>

            {/* Context Menu */}
            {contextMenu.type && (
                <div
                    ref={contextMenuRef}
                    className="absolute z-10 rounded border bg-white shadow-lg"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={handleDelete} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">
                        Delete
                    </button>
                </div>
            )}

            {/* Message Input - Sticky at the bottom */}
            {!showFiles && (
                <div className="sticky bottom-0 z-10 border-t bg-white p-4 shadow-md">
                    <MessageInput chatId={chat.id} onSend={refreshChatData} />
                </div>
            )}
        </div>
    );
}
