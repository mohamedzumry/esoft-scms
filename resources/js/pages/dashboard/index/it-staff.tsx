import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

// Define types for the props
interface CourseMetrics {
    total: number;
    new: number;
}

interface StudentMetrics {
    active: number;
    pending: number;
}

interface LecturerMetrics {
    total: number;
    available: number;
}

interface ITStaffDashboardProps extends PageProps {
    courses: CourseMetrics;
    students: StudentMetrics;
    lecturers: LecturerMetrics;
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ITStaffDashboard() {
    const { courses, students, lecturers } = usePage<ITStaffDashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="IT Staff Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Key Metrics Cards */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                            <BookOpen className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{courses.total}</div>
                            <p className="text-muted-foreground text-xs">+{courses.new} this month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.active}</div>
                            <p className="text-muted-foreground text-xs">{students.pending} pending approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{lecturers.total}</div>
                            <p className="text-muted-foreground text-xs">{lecturers.available} available</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}