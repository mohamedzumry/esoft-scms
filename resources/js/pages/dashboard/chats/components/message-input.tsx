import { useState } from "react";
import { router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
    chatId: number;
    onSend?: () => void;
}

export default function MessageInput({ chatId, onSend }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim() && !file) return;

        setIsSending(true);

        const formData = new FormData();
        if (message.trim()) formData.append("message", message);
        if (file) formData.append("file", file);

        try {
            await new Promise((resolve, reject) => {
                router.post(
                    file
                        ? `/dashboard/chats/${chatId}/files`
                        : `/dashboard/chats/${chatId}/messages`,
                    formData,
                    {
                        onSuccess: () => resolve(true),
                        onError: (errors) => reject(new Error(JSON.stringify(errors))),
                    }
                );
            });

            setMessage("");
            setFile(null);
            onSend?.();
        } catch (error) {
            console.error("Failed to send:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isSending}
                onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
            />
            <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isSending}
                onKeyUp={(e) => e.key === "Enter" && handleSendMessage()}
                className="w-auto"
            />
            <Button onClick={handleSendMessage} disabled={isSending}>
                {file ? <Paperclip className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
        </div>
    );
}