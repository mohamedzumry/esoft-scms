import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
    chatId: number;
}

export default function MessageInput({ chatId }: MessageInputProps) {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (message.trim()) {
            // Send message to the backend
            await axios.post(`/api/chats/${chatId}/messages`, { message });
            setMessage("");
        }
    };

    return (
        <div className="flex gap-2">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
            </Button>
        </div>
    );
}