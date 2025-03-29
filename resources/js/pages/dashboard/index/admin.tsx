import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { 
    Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    BarElement,
    ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

// Register all necessary Chart.js components for a Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement);

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

interface RecentCourse {
    id: number;
    title: string;
    instructor: string;
    enrollments: number;
}

interface AdminDashboardProps extends PageProps {
    courses: CourseMetrics;
    students: StudentMetrics;
    lecturers: LecturerMetrics;
    recentCourses: RecentCourse[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function AdminDashboard() {
    const { courses, students, lecturers, recentCourses } = usePage<AdminDashboardProps>().props;

    const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);

    useEffect(() => {
        const mockData: ChartData<'bar'> = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
                {
                    label: 'Enrollments',
                    data: [120, 150, 180, 210, 240],
                    backgroundColor: '#6366f1',
                },
            ],
        };
        setChartData(mockData);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
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

                    {/* Recent Courses */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Instructor</TableHead>
                                            <TableHead className="text-right">Enrollments</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentCourses.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell>{course.title}</TableCell>
                                                <TableCell>{course.instructor}</TableCell>
                                                <TableCell className="text-right">{course.enrollments}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enrollment Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            {chartData ? (
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                        },
                                    }}
                                />
                            ) : (
                                <p className="text-muted-foreground">Loading chart...</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}