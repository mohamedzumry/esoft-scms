import { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUploadButton from "./file-upload-button";
import FileList from "./file-list";
import MessageInput from "./message-input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatViewProps {
  chatId: number;
}

export default function ChatView({ chatId }: ChatViewProps) {
  const [showFiles, setShowFiles] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      {/* File View and Upload Buttons */}
      <div className="p-4 border-b flex justify-between">
        <Button variant="ghost" onClick={() => setShowFiles(!showFiles)}>
          {showFiles ? "Hide Files" : "View Files"}
        </Button>
        <FileUploadButton chatId={chatId} />
      </div>

      {/* File List or Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        {showFiles ? <FileList chatId={chatId} /> : <div>Chat Messages</div>}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <MessageInput chatId={chatId} />
      </div>
    </div>
  );
}