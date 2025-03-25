import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import CreateBatch from './create';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Batches', href: '/dashboard/batches' }];

interface Batch {
    id: number;
    code: string;
    course: Course;
}

interface Course {
    id: number;
    name: string;
}

interface BatchProps {
    batches: Batch[];
    courses: Course[];
}

export default function BatchIndex({ batches, courses }: BatchProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            router.delete(`/dashboard/batches/${id}`, {
                onSuccess: () => toast.success('Batch deleted successfully'),
                onError: (errors) => toast.error('Failed to delete batch'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batches" />
            <div className="p-6">
                <div className="mb-4 flex justify-between">
                    <h1 className="text-2xl font-bold">Batches</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Create Batch</Button>
                </div>
                <ul className="space-y-2">
                    {batches.map((batch) => (
                        <li key={batch.id} className="flex items-center justify-between rounded bg-white p-4 shadow">
                            <p className="font-semibold">{batch.code}</p>
                            <br />
                            <p>{batch.course.name}</p>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(batch.id)}>
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <CreateBatch courses={courses} open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </AppLayout>
    );
}
