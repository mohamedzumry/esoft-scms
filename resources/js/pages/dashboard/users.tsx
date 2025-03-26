import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Define the structure of a User
interface User {
    id: number;
    name: string;
    nick_name: string;
    email: string;
    role: string;
}

// Define the PaginationLink interface
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Define the users prop structure (paginated)
interface UsersProp {
    data: User[];
    links: PaginationLink[];
    last_page: number;
}

// Define UsersPageProps by extending PageProps from @inertiajs/react
interface UsersPageProps extends PageProps {
    users: UsersProp;
    availableRoles: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/dashboard/users',
    },
];

export default function Users() {
    const { users, availableRoles } = usePage<UsersPageProps>().props;

    const filteredLinks = users.last_page > 1 ? users.links : users.links.filter((link) => link.label !== '&laquo;' && link.label !== '&raquo;');

    // Format role labels (e.g., 'it_staff' → 'IT Staff')
    const formatRoleLabel = (role: string) => {
        return role
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'student',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('user.register'), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col h-full p-4 rounded-xl gap-4">
                <Button size="sm" onClick={() => setIsOpen(true)} className="w-fit mb-4">
                    Add New User
                </Button>

                {/* Users Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Display Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.nick_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex gap-2 mt-4">
                    {users.links
                        .filter((link) => link.url !== null)
                        .map((link) => (
                            <Link
                                key={link.label}
                                href={link.url ?? '#'}
                                className={`rounded border px-3 py-1 ${link.active ? 'bg-gray-200 text-black' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                </div>

                {/* Add User Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent id="cud" aria-describedby="cud">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    required
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete="true"
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    required
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="true"
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                            </div>
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <select
                                    required
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="border rounded w-full px-2 py-1"
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {formatRoleLabel(role)}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                            </div>
                            <Button type="submit" disabled={processing}>
                                Create User
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
