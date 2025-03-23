import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react'; // Added router for actions
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import CreateReservationForm from './create-reservation-form';

// Define Reservation interface
interface Reservation {
    id: number;
    reserved_by: number;
    resource_id: number;
    start_date_time: string;
    end_date_time: string;
    purpose: string;
    description: string;
    course?: string | null;
    batch?: string | null;
    approval_status: 'pending' | 'approved' | 'rejected' | 'cancelled'; // Added 'cancelled'
    created_at: string;
    updated_at: string;
    user: { id: number; name: string };
    resource: { id: number; name: string };
}

// Define Resource interface
interface Resource {
    id: number;
    name: string;
}

// Define props interface for Index component
interface IndexProps {
    reservations: Reservation[];
    resources: Resource[];
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

export default function Index({ reservations, resources, auth }: IndexProps) {
    const { flash } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<'approved' | 'rejected' | 'pending' | 'cancelled'>('approved');

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Filter reservations based on status
    const pendingReservations = reservations.filter((r) => r.approval_status === 'pending');
    const approvedReservations = reservations.filter((r) => r.approval_status === 'approved');
    const rejectedReservations = reservations.filter((r) => r.approval_status === 'rejected');
    const cancelledReservations = reservations.filter((r) => r.approval_status === 'cancelled');

    // Check if user is admin or it_staff
    const isAdminOrStaff = auth.user.role === 'admin' || auth.user.role === 'it_staff';

    return (
        <AppLayout>
            <Head title="Reservations" />

            <div className="container mx-auto px-4 py-8">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="mb-4 w-fit">
                            Create Reservation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Reservation</DialogTitle>
                        </DialogHeader>
                        <CreateReservationForm resources={resources} userRole={auth.user.role} />
                    </DialogContent>
                </Dialog>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'approved' | 'rejected' | 'pending' | 'cancelled')}>
                    <TabsList className="mb-8 flex justify-center space-x-4">
                        {isAdminOrStaff && (
                            <TabsTrigger value="pending" className="px-4 py-2">
                                Pending
                            </TabsTrigger>
                        )}
                        <TabsTrigger value="approved" className="px-4 py-2">
                            Approved
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="px-4 py-2">
                            Rejected
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" className="px-4 py-2">
                            Cancelled
                        </TabsTrigger>
                    </TabsList>

                    {isAdminOrStaff && (
                        <TabsContent value="pending">
                            {pendingReservations.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {pendingReservations.map((reservation) => (
                                        <ReservationCard key={reservation.id} reservation={reservation} auth={auth} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No pending reservations found.</p>
                            )}
                        </TabsContent>
                    )}

                    <TabsContent value="approved">
                        {approvedReservations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {approvedReservations.map((reservation) => (
                                    <ReservationCard key={reservation.id} reservation={reservation} auth={auth} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No approved reservations found.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="rejected">
                        {rejectedReservations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {rejectedReservations.map((reservation) => (
                                    <ReservationCard key={reservation.id} reservation={reservation} auth={auth} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No rejected reservations found.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled">
                        {cancelledReservations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {cancelledReservations.map((reservation) => (
                                    <ReservationCard key={reservation.id} reservation={reservation} auth={auth} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No cancelled reservations found.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

// Define props interface for ReservationCard component
interface ReservationCardProps {
    reservation: Reservation;
    auth: IndexProps['auth']; // Pass auth to check user role and ownership
}

// Reservation Card Component
function ReservationCard({ reservation, auth }: ReservationCardProps) {
    const isAdminOrStaff = auth.user.role === 'admin' || auth.user.role === 'it_staff';
    const isCreator = auth.user.id === reservation.reserved_by;

    const handleApprove = () => {
        router.put(
            route('reservations.approve', reservation.id),
            {},
            {
                onSuccess: () => toast.success('Reservation approved'),
            },
        );
    };

    const handleReject = () => {
        router.put(
            route('reservations.reject', reservation.id),
            {},
            {
                onSuccess: () => toast.success('Reservation rejected'),
            },
        );
    };

    const handleCancel = () => {
        router.put(
            route('reservations.cancel', reservation.id),
            {},
            {
                onSuccess: () => toast.success('Reservation cancelled'),
            },
        );
    };

    const handleDelete = () => {
        router.delete(route('reservations.destroy', reservation.id), {
            onSuccess: () => toast.success('Reservation deleted'),
        });
    };

    return (
        <Card className="overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{reservation.purpose}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    {reservation.resource.name} - {new Date(reservation.start_date_time).toLocaleString()} to{' '}
                    {new Date(reservation.end_date_time).toLocaleString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-sm text-gray-600">{reservation.description}</p>
                <p className="mt-2 text-sm text-gray-500">Reserved by: {reservation.user.name}</p>
                <p className="mt-2 text-sm text-gray-500">Status: {reservation.approval_status}</p>
                {reservation.course && <p className="mt-2 text-sm text-gray-500">Course: {reservation.course}</p>}
                {reservation.batch && <p className="mt-2 text-sm text-gray-500">Batch: {reservation.batch}</p>}

                {/* Buttons based on status */}
                <div className="mt-4 flex space-x-2">
                    {reservation.approval_status === 'pending' && isAdminOrStaff && (
                        <>
                            <Button variant="default" size="sm" onClick={handleApprove}>
                                Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={handleReject}>
                                Reject
                            </Button>
                        </>
                    )}
                    {(reservation.approval_status === 'rejected' || reservation.approval_status === 'cancelled') && (isAdminOrStaff || isCreator) && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    {reservation.approval_status === 'approved' && (isAdminOrStaff || isCreator) && (
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
