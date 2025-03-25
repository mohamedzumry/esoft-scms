import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
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
}

// Simple URL detection regex
const urlRegex = /(https?:\/\/[^\s]+)/g;

export default function ChatView({ chat, messages, auth }: ChatViewProps) {
    const [showFiles, setShowFiles] = useState<boolean>(false);

    return (
        <div className="flex flex-1 flex-col bg-gray-100">
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
            <ScrollArea className="flex-1 p-4">
                {showFiles ? (
                    chat.files && chat.files.length > 0 ? (
                        <div className="space-y-2">
                            {chat.files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between rounded bg-white p-2 shadow">
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
                            <div key={message.id} className={`mb-4 flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`relative max-w-xs rounded-lg p-3 shadow ${
                                        isSent ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
                                    }`}
                                >
                                    {/* Message Bubble Tail */}
                                    <div
                                        className={`absolute top-0 h-0 w-0 border-t-8 border-b-8 border-transparent ${
                                            isSent ? 'right-[-8px] border-l-8 border-l-green-500' : 'left-[-8px] border-r-8 border-r-white'
                                        }`}
                                    />

                                    {/* Message Text (without URLs) */}
                                    {messageWithoutUrls && <p className="text-sm">{messageWithoutUrls}</p>}

                                    {/* Extracted URLs */}
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

                                    {/* Timestamp */}
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

            {/* Message Input */}
            {!showFiles && (
                <div className="border-t bg-white p-4">
                    <MessageInput chatId={chat.id} />
                </div>
            )}
        </div>
    );
}
