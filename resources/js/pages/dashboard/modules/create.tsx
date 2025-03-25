import { useForm, Controller } from "react-hook-form";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateModuleProps {
    open: boolean;
    onClose: () => void;
    courses: Course[];
}

interface Course {
    id: number;
    name: string;
}

interface ModuleFormData {
    name: string;
    description?: string;
    is_active: boolean;
}

export default function CreateModule({ open, onClose, courses }: CreateModuleProps) {
    const { register, handleSubmit } = useForm<ModuleFormData>({
        defaultValues: {
            is_active: false,
        },
    });

    const onSubmit = (data: any) => {
        router.post("/dashboard/modules", data, {
            onSuccess: () => onClose(),
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Module</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Module Name" {...register("name", { required: true })} />
                    <Input placeholder="Description" {...register("description")} />
                    <div className="flex items-center space-x-2">
                        <Checkbox id="is_active" {...register("is_active")} />
                        <label htmlFor="is_active">Is Active</label>
                    </div>
                    <Button type="submit">Create Module</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}