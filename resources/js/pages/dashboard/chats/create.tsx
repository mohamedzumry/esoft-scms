import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

interface CreateChatProps {
    open: boolean;
    onClose: () => void;
    auth: { user: { id: number; role: string } };
    courses: Course[];
}

interface Course {
    id: number;
    name: string;
}

interface Batch {
    id: number;
    code: string;
}

interface Module {
    id: number;
    name: string;
}

interface ChatFormData {
    chat_name: string;
    course_id: number;
    batch_id: number;
    module_id?: number;
}

export default function CreateChat({ open, onClose, auth, courses }: CreateChatProps) {
    const { register, handleSubmit, watch, setValue } = useForm<ChatFormData>();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const selectedCourse = watch("course_id");

    useEffect(() => {
        if (selectedCourse !== undefined) { // Type guard
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

            // Fetch batches
            fetch(`/dashboard/chats/batches/${selectedCourse}`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then((data) => setBatches(data.batches || []))
                .catch((error) => {
                    console.error("Failed to fetch batches:", error);
                    setBatches([]);
                });

            // Fetch modules
            fetch(`/dashboard/chats/modules/${selectedCourse}`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then((data) => setModules(data.modules || []))
                .catch((error) => {
                    console.error("Failed to fetch modules:", error);
                    setModules([]);
                });
        } else {
            setBatches([]);
            setModules([]);
        }
    }, [selectedCourse]);

    const onSubmit = (data: ChatFormData) => {
        router.post("/dashboard/chats", data as Record<string, any>, {
            onSuccess: () => onClose(),
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input required placeholder="Chat Name" {...register("chat_name", { required: true })} />
                    <Select
                        required
                        options={courses.map((course) => ({ value: course.id, label: course.name }))}
                        onChange={(option) => setValue("course_id", option!.value)}
                        placeholder="Search Courses"
                        isSearchable
                    />
                    <Select
                        required
                        options={batches.map((batch) => ({ value: batch.id, label: batch.code }))}
                        onChange={(option) => setValue("batch_id", option!.value)}
                        placeholder="Search Batches"
                        isSearchable
                        isDisabled={!selectedCourse}
                    />
                    <Select
                        required={!(auth.user.role === "admin" || auth.user.role === "it_staff")}
                        options={modules.map((module) => ({ value: module.id, label: module.name }))}
                        onChange={(option) => setValue("module_id", option?.value)}
                        placeholder="Search Modules (Optional)"
                        isSearchable
                        isDisabled={!selectedCourse}
                    />
                    <Button type="submit">Create Chat</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}