import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import CreateModule from "./create";
import toast, { Toaster } from "react-hot-toast";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Modules", href: "/dashboard/modules" },
];

interface Module {
    id: number;
    name: string;
    description?: string | null;
    is_active: boolean;
}

interface ModuleProps {
    modules: Module[];
}

export default function ModuleIndex({ modules }: ModuleProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this module?")) {
            router.delete(`/dashboard/modules/${id}`, {
                onSuccess: () => toast.success("Module deleted successfully"),
                onError: (errors) => toast.error("Failed to delete module"),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modules" />
            <div className="p-6">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Modules</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Create Module</Button>
                </div>
                <ul className="space-y-2">
                    {modules.map((module) => (
                        <li
                            key={module.id}
                            className="p-4 bg-white rounded shadow flex justify-between items-start"
                        >
                            <div>
                                <span className="font-semibold">{module.name}</span> -{" "}
                                {module.is_active ? "Active" : "Inactive"}
                                {module.description && (
                                    <p className="text-gray-600">{module.description}</p>
                                )}
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(module.id)}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <CreateModule open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </AppLayout>
    );
}