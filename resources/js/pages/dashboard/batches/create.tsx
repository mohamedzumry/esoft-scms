import { useForm } from "react-hook-form";
import { router, usePage } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";

interface CreateBatchProps {
    open: boolean;
    onClose: () => void;
    courses: Course[];
}

interface Course {
    id: number;
    name: string;
}

export default function CreateBatch({ open, onClose, courses }: CreateBatchProps) {
    const { register, handleSubmit, setValue } = useForm();
    const { props } = usePage();

    const onSubmit = (data: any) => {
        router.post("/dashboard/batches", data, {
            onSuccess: () => onClose(),
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Batch</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input required placeholder="Batch Code" {...register("code", { required: true })} />
                    <Select
                        options={courses.map((course) => ({ value: course.id, label: course.name }))}
                        onChange={(option) => setValue("course_id", option?.value)}
                        placeholder="Select Course"
                        isSearchable
                    />
                    <Button type="submit">Create Batch</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}