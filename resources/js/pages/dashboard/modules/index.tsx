import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AssignLecturersToModuleDialog from '../courses/dialogs/assign-lecturers-to-module-dialog';
import AssignStudentsToModuleDialog from '../courses/dialogs/assign-students-to-module-dialog';
import CreateModule from './create';
import AssignModuleToCoursesDialog from './dialogs/assign-module-to-courses-dialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Modules', href: '/dashboard/modules' }];

interface Module {
    id: number;
    name: string;
    description?: string | null;
    is_active: boolean;
    course_id: number;
    courses: { id: number; name: string }[]; // Add courses array to display assigned courses
}

interface User {
    id: number;
    name: string;
}

interface Course {
    id: number;
    name: string;
}

interface ModuleProps {
    modules: Module[];
    students: User[];
    lecturers: User[];
    courses: Course[];
}

export default function ModuleIndex({ modules, students, lecturers, courses }: ModuleProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isAssignStudentsOpen, setIsAssignStudentsOpen] = useState<boolean>(false);
    const [isAssignLecturersOpen, setIsAssignLecturersOpen] = useState<boolean>(false);
    const [isAssignCoursesOpen, setIsAssignCoursesOpen] = useState<boolean>(false); // New state for the courses dialog
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this module?')) {
            router.delete(`/dashboard/modules/${id}`, {
                onSuccess: () => toast.success('Module deleted successfully'),
                onError: (errors) => toast.error('Failed to delete module'),
            });
        }
    };

    const openAssignStudentsDialog = (moduleId: number) => {
        const module = modules.find((m) => m.id === moduleId);
        if (!module?.course_id) {
            toast.error("Cannot assign students: Module is not associated with a course");
            return;
        }
        setSelectedModuleId(moduleId);
        setIsAssignStudentsOpen(true);
    };

    const openAssignLecturersDialog = (moduleId: number) => {
        const module = modules.find((m) => m.id === moduleId);
        if (!module?.course_id) {
            toast.error("Cannot assign lecturers: Module is not associated with a course");
            return;
        }
        setSelectedModuleId(moduleId);
        setIsAssignLecturersOpen(true);
    };

    const openAssignCoursesDialog = (moduleId: number) => {
        setSelectedModuleId(moduleId);
        setIsAssignCoursesOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="p-6">
                <div className="mb-4 flex justify-between">
                    <h1 className="text-2xl font-bold">Modules</h1>
                    <div className="space-x-2">
                        <Button onClick={() => setIsCreateModalOpen(true)}>Create Module</Button>
                    </div>
                </div>
                <ul className="space-y-2">
                    {modules.map((module) => (
                        <li key={module.id} className="flex items-start justify-between rounded bg-white p-4 shadow">
                            <div>
                                <span className="font-semibold">{module.name}</span> - {module.is_active ? 'Active' : 'Inactive'}
                                {module.description && <p className="text-gray-600">{module.description}</p>}
                                <p className="text-gray-600">
                                    Assigned Courses: {module.courses.length > 0 ? module.courses.map(c => c.name).join(', ') : 'None'}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openAssignCoursesDialog(module.id)}>
                                    Assign Courses
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => openAssignStudentsDialog(module.id)}>
                                    Assign Students
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => openAssignLecturersDialog(module.id)}>
                                    Assign Lecturers
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(module.id)}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <CreateModule open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} courses={courses} />
            {selectedModuleId && (
                <>
                    <AssignStudentsToModuleDialog
                        open={isAssignStudentsOpen}
                        onClose={() => setIsAssignStudentsOpen(false)}
                        moduleId={selectedModuleId}
                        students={students}
                    />
                    <AssignLecturersToModuleDialog
                        open={isAssignLecturersOpen}
                        onClose={() => setIsAssignLecturersOpen(false)}
                        moduleId={selectedModuleId}
                        lecturers={lecturers}
                        module={modules.find((m) => m.id === selectedModuleId)!}
                    />
                    <AssignModuleToCoursesDialog
                        open={isAssignCoursesOpen}
                        onClose={() => setIsAssignCoursesOpen(false)}
                        moduleId={selectedModuleId}
                        courses={courses}
                    />
                </>
            )}
        </AppLayout>
    );
}