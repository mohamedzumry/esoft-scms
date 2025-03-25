import { useState } from "react";
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
            const response = await fetch(
                file
                    ? `/dashboard/chats/${chatId}/files`
                    : `/dashboard/chats/${chatId}/messages`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `Failed to send: ${response.status} ${response.statusText} - ${
                        errorData.message || "No error message"
                    }`
                );
            }

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
                className="w-auto"
            />
            <Button onClick={handleSendMessage} disabled={isSending}>
                {file ? <Paperclip className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
        </div>
    );
}