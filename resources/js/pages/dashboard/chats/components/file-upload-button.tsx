import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

interface FileUploadButtonProps {
  chatId: number;
}

export default function FileUploadButton({ chatId }: FileUploadButtonProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    router.post(route("chats.files.store", chatId), formData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => console.log("File uploaded successfully"),
      onError: (errors) => console.error("Failed to upload file:", errors),
    });
  };

  return (
    <Button asChild>
      <label>
        Upload File
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </Button>
  );
}