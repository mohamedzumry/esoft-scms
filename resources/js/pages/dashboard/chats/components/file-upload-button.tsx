import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MessageInputProps {
    chatId: number;
}

export default function MessageInput({ chatId }: MessageInputProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                await axios.post(`/api/chats/${chatId}/files`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setFile(null); // Clear file input after upload
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    return (
        <div className="flex gap-2">
            {/* File Input */}
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
                htmlFor="file-upload"
                className="flex items-center justify-center p-2 border rounded cursor-pointer"
            >
                <Upload className="h-4 w-4 mr-2" />
                {file ? file.name : "Choose File"}
            </label>

            {/* Upload Button */}
            <Button onClick={handleUpload} disabled={!file}>
                Upload
            </Button>
        </div>
    );
}