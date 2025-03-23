import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import CreateResourceForm from './create-resource-form';

// Define Resource interface
interface Resource {
    id: number;
    name: string;
    category: string;
    description: string;
    capacity?: number | null;
    created_at: string;
    updated_at: string;
}

// Define props interface for Index component
interface IndexProps {
    resources: Resource[];
    categories: { value: string; label: string }[];
    auth: {
        user: {
            id: number;
            role: string; // Assuming role is a string like 'admin', 'it_staff', etc.
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resources',
        href: '/dashboard/resources',
    },
];

export default function Index({ resources, auth, categories }: IndexProps) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resources" />

            <div className="container mx-auto px-4 py-8">
                {/* Create Resource Button and Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="mb-4 w-fit">
                            Create Resource
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Resource</DialogTitle>
                        </DialogHeader>
                        <CreateResourceForm categories={categories} />
                    </DialogContent>
                </Dialog>

                {/* Resources List */}
                {resources.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} userRole={auth.user.role} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No resources found.</p>
                )}
            </div>
        </AppLayout>
    );
}

// Define props interface for ResourceCard component
interface ResourceCardProps {
    resource: Resource;
    userRole: string;
}

// Resource Card Component
function ResourceCard({ resource, userRole }: ResourceCardProps) {
    const canDelete = ['admin', 'it_staff'].includes(userRole);

    return (
        <Card className="overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{resource.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    <span className="text-sm font-bold text-gray-600">Category :</span> {resource.category}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-sm font-bold text-gray-600">Description</p>
                <p className="text-sm text-gray-600">{resource.description}</p>
                {resource.capacity && <p className="mt-2 text-sm text-gray-500">Capacity: {resource.capacity}</p>}
                {canDelete && (
                    <div className="mt-4 flex justify-end">
                        <Button variant="destructive" asChild>
                            <Link href={route('resources.destroy', resource.id)} method="delete" as="button">
                                Delete
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
