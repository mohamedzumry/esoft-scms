import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import MessageInput from './message-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

// Define TypeScript interfaces
interface File {
    id: number;
    name: string;
    url: string;
    uploaded_by: { id: number; name: string };
    created_at: string;
}

interface Message {
    id: number;
    user: { id: number; name: string; role: string; email: string; nick_name: string };
    message: string;
    created_at: string;
}

interface Chat {
    id: number;
    chat_name: string;
    creator?: { id: number; name: string; role: string; email: string; nick_name: string };
    course: { id: number; name: string };
    batch: { id: number; code: string };
    module?: { id: number; name: string } | null;
    can_delete: boolean;
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
    const [deleteDialog, setDeleteDialog] = useState<{
        type: 'message' | 'file' | null;
        id: number | null;
    }>({ type: null, id: null });
    const [deleting, setDeleting] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<{ type: 'message' | 'file'; id: number } | null>(null);

    const { flash } = usePage().props as any;

    // Reverse the order of messages to show newest at the bottom
    const reversedMessages = [...messages].reverse();

    const handleItemClick = (type: 'message' | 'file', id: number) => {
        setActiveItem((prev) =>
            prev && prev.type === type && prev.id === id ? null : { type, id }
        );
    };

    const handleDeleteClick = (type: 'message' | 'file', id: number) => {
        setDeleteDialog({ type, id });
        setActiveItem(null);
    };

    const handleDelete = () => {
        if (!deleteDialog.type || !deleteDialog.id) return;

        const endpoint =
            deleteDialog.type === 'message'
                ? `/dashboard/chats/${chat.id}/messages/${deleteDialog.id}`
                : `/dashboard/chats/${chat.id}/files/${deleteDialog.id}`;

        setDeleting(true);
        router.delete(endpoint, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // const successMessage = flash?.success || `${deleteDialog.type === 'message' ? 'Message' : 'File'} deleted successfully`;
                // toast.success(successMessage);
                refreshChatData?.();
            },
            onError: () => {
                // const errorMessage = flash?.error || `Failed to delete ${deleteDialog.type}`;
                // toast.error(errorMessage);
            },
            onFinish: () => {
                setDeleting(false);
                setDeleteDialog({ type: null, id: null });
            },
        });
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
                className="flex-grow overflow-y-auto p-4"
                style={{ maxHeight: 'calc(100vh - 128px)' }}
            >
                {showFiles ? (
                    chat.files && chat.files.length > 0 ? (
                        <div className="space-y-2">
                            {chat.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="group flex items-center justify-between rounded bg-white p-2 shadow hover:bg-gray-50"
                                    onClick={() => handleItemClick('file', file.id)}
                                >
                                    <div>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {file.name}
                                        </a>
                                        <p className="text-xs text-gray-500">
                                            Uploaded by {file.uploaded_by.name} at {new Date(file.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`${
                                            activeItem?.type === 'file' && activeItem?.id === file.id
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick('file', file.id);
                                        }}
                                        aria-label={`Delete file ${file.name}`}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No files uploaded yet.</p>
                    )
                ) : reversedMessages.length > 0 ? (
                    reversedMessages.map((message) => {
                        const isSent = message.user.id === auth.user.id;
                        const urls = message.message.match(urlRegex) || [];
                        const messageWithoutUrls = message.message.replace(urlRegex, '').trim();

                        // Check if the current user is allowed to delete the message
                        const canDelete =
                            isSent ||
                            (chat.creator?.id === auth.user.id) ||
                            ['it_staff', 'admin'].includes(auth.user.role);

                        return (
                            <div
                                key={message.id}
                                className={`mb-4 flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                onClick={() => handleItemClick('message', message.id)}
                            >
                                <div className="group relative flex items-center">
                                    <div
                                        className={`relative max-w-xs rounded-lg p-3 shadow ${
                                            isSent ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-0 h-0 w-0 border-t-8 border-b-8 border-transparent ${
                                                isSent
                                                    ? 'right-[-8px] border-l-8 border-l-green-500'
                                                    : 'left-[-8px] border-r-8 border-r-white'
                                            }`}
                                        />
                                        {/* Show sender's name only for messages not sent by the current user */}
                                        {!isSent && (
                                            <p className="text-sm font-semibold text-blue-600 mb-1">
                                                {message.user.name}
                                            </p>
                                        )}
                                        {messageWithoutUrls && <p className="text-sm">{messageWithoutUrls}</p>}
                                        {urls.length > 0 && (
                                            <div className="mt-1">
                                                {urls.map((url, index) => (
                                                    <a
                                                        key={index}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`block text-sm underline hover:text-blue-600 ${
                                                            isSent ? 'text-white' : 'text-black'
                                                        }`}
                                                    >
                                                        {url}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                        <span
                                            className={`mt-1 block text-right text-xs ${
                                                isSent ? 'text-gray-200' : 'text-gray-400'
                                            }`}
                                        >
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    {canDelete && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`ml-2 ${
                                                activeItem?.type === 'message' && activeItem?.id === message.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0 group-hover:opacity-100'
                                            } ${isSent ? 'order-first ml-0 mr-2' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick('message', message.id);
                                            }}
                                            aria-label={`Delete message from ${message.user.name}`}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">No messages yet.</p>
                )}
            </ScrollArea>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.type !== null}
                onOpenChange={() => setDeleteDialog({ type: null, id: null })}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {deleteDialog.type === 'message' ? 'Message' : 'File'}</DialogTitle>
                    </DialogHeader>
                    <p>
                        Are you sure you want to delete this{' '}
                        {deleteDialog.type === 'message' ? 'message' : 'file'}? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ type: null, id: null })}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Message Input - Sticky at the bottom */}
            {!showFiles && (
                <div className="sticky bottom-0 z-10 border-t bg-white p-4 shadow-md">
                    <MessageInput chatId={chat.id} onSend={refreshChatData} />
                </div>
            )}
        </div>
    );
}