import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

interface File {
  id: number;
  file_name: string;
  path: string;
  uploaded_by: { id: number; name: string };
}

interface FileListProps {
  chatId: number;
}

export default function FileList({ chatId }: FileListProps) {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    router.get(
      route("chats.show", chatId),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          setFiles(page.props.files as File[]);
        },
        onError: (errors) => console.error("Failed to load files:", errors),
      }
    );
  }, [chatId]);

  return (
    <div>
      {files.length > 0 ? (
        files.map((file) => (
          <div key={file.id} className="mb-2">
            <a
              href={`/storage/${file.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {file.file_name}
            </a>{" "}
            <span className="text-gray-500">
              (Uploaded by {file.uploaded_by.name})
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No files uploaded yet.</p>
      )}
    </div>
  );
}