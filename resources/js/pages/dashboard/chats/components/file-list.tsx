import { File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useEffect, useState } from 'react';

interface FileListProps {
  chatId: number;
}

export default function FileList({ chatId }: FileListProps) {
  const [files, setFiles] = useState<Array<{ id: number; name: string; url: string }>>([]);

  useEffect(() => {
    axios.get(`/api/chats/${chatId}/files`).then((response) => {
      setFiles(response.data);
    });
  }, [chatId]);

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-2 border rounded">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>{file.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.open(file.url)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}