import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import CreateCourse from "./create";
import toast, { Toaster } from "react-hot-toast";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Courses", href: "/dashboard/courses" },
];

interface Course {
    id: number;
    name: string;
    description?: string | null;
    code?: string | null;
    is_active: boolean;
}

interface CourseProps {
    courses: Course[];
}

export default function CourseIndex({ courses }: CourseProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            router.delete(`/dashboard/courses/${id}`, {
                onSuccess: () => toast.success("Course deleted successfully"),
                onError: (errors) => toast.error("Failed to delete course"),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Create Course</Button>
                </div>
                <ul className="space-y-2">
                    {courses.map((course) => (
                        <li key={course.id} className="p-4 bg-white rounded shadow flex justify-between items-start">
                            <div>
                                <span className="font-semibold">{course.name}</span> ({course.code || "No Code"}) -{" "}
                                {course.is_active ? "Active" : "Inactive"}
                                {course.description && <p className="text-gray-600">{course.description}</p>}
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(course.id)}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <CreateCourse open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </AppLayout>
    );
}