import { useForm, Controller } from "react-hook-form";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateModuleProps {
    open: boolean;
    onClose: () => void;
}

interface ModuleFormData {
    name: string;
    description?: string;
    is_active: boolean;
}

export default function CreateModule({ open, onClose }: CreateModuleProps) {
    const { register, handleSubmit, control } = useForm<ModuleFormData>({
        defaultValues: {
            is_active: false,
        },
    });

    const onSubmit = (data: ModuleFormData) => {
        router.post("/dashboard/modules", data as Record<string, any>, {
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
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="is_active"
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                />
                            )}
                        />
                        <label htmlFor="is_active">Is Active</label>
                    </div>
                    <Button type="submit">Create Module</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}