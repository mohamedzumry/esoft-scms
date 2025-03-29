import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen } from 'lucide-react';

// Define types for the props
interface RecentCourse {
    id: number;
    title: string;
    instructor: string;
    enrollments: number;
}

interface StudentDashboardProps extends PageProps {
    enrolledCourses: RecentCourse[];
    totalCourses: number;
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function StudentDashboard() {
    const { enrolledCourses, totalCourses } = usePage<StudentDashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Total Enrolled Courses Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                            <BookOpen className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCourses}</div>
                            <p className="text-muted-foreground text-xs">Courses you are currently enrolled in</p>
                        </CardContent>
                    </Card>

                    {/* Enrolled Courses Table */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Your Enrolled Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {enrolledCourses.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Instructor</TableHead>
                                            <TableHead className="text-right">Enrollments</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {enrolledCourses.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell>{course.title}</TableCell>
                                                <TableCell>{course.instructor}</TableCell>
                                                <TableCell className="text-right">{course.enrollments}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}