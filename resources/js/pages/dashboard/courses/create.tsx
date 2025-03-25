import { useForm, Controller } from "react-hook-form";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateCourseProps {
    open: boolean;
    onClose: () => void;
}

interface CourseFormData {
    name: string;
    description?: string;
    code?: string;
    is_active: boolean;
}

export default function CreateCourse({ open, onClose }: CreateCourseProps) {
    const { register, handleSubmit, control } = useForm<CourseFormData>({
        defaultValues: {
            is_active: false,
        },
    });

    const onSubmit = (data: CourseFormData) => {
        router.post("/dashboard/courses", data as Record<string, any>, {
            onSuccess: () => onClose(),
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Course Name" {...register("name", { required: true })} />
                    <Input placeholder="Description" {...register("description")} />
                    <Input placeholder="Code" {...register("code")} />
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
                    <Button type="submit">Create Course</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}