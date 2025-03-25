import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CreateCourse from './create';
import AssignStudentsToCourseDialog from './dialogs/assign-students-to-course-dialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Courses', href: '/dashboard/courses' }];

interface Course {
    id: number;
    name: string;
    description?: string | null;
    code?: string | null;
    is_active: boolean;
}

interface User {
    id: number;
    name: string;
}

interface Batch {
    id: number;
    name: string;
}

interface CourseProps {
    courses: Course[];
    students: User[];
    batches: Batch[];
}

export default function CourseIndex({ courses, students, batches }: CourseProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isAssignStudentsOpen, setIsAssignStudentsOpen] = useState<boolean>(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(`/dashboard/courses/${id}`, {
                onSuccess: () => toast.success('Course deleted successfully'),
                onError: (errors) => toast.error('Failed to delete course'),
            });
        }
    };

    const openAssignStudentsDialog = (courseId: number) => {
        setSelectedCourseId(courseId);
        setIsAssignStudentsOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="p-6">
                <div className="mb-4 flex justify-between">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <div className="space-x-2">
                        <Button onClick={() => setIsCreateModalOpen(true)}>Create Course</Button>
                    </div>
                </div>
                <ul className="space-y-2">
                    {courses.map((course) => (
                        <li key={course.id} className="flex items-start justify-between rounded bg-white p-4 shadow">
                            <div>
                                <span className="font-semibold">{course.name}</span> ({course.code || 'No Code'}) -{' '}
                                {course.is_active ? 'Active' : 'Inactive'}
                                {course.description && <p className="text-gray-600">{course.description}</p>}
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openAssignStudentsDialog(course.id)}>
                                    Assign Students
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <CreateCourse open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            {selectedCourseId && (
                <AssignStudentsToCourseDialog
                    open={isAssignStudentsOpen}
                    onClose={() => setIsAssignStudentsOpen(false)}
                    courseId={selectedCourseId}
                    students={students}
                />
            )}
        </AppLayout>
    );
}
