import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CreateEventForm from './create-event-form';

// Define event type
interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    venue: string;
    description?: string;
    event_image?: string;
    registration_link?: string;
    created_by: number; // Assuming this is the user ID who created the event
}

interface Category {
    id: number;
    name: string;
}

// Define props interface for Index component
interface IndexProps {
    upcomingEvents: Event[];
    pastEvents: Event[];
    categories: Category[];
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

export default function Index({ upcomingEvents, pastEvents, categories, auth }: IndexProps) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    return (
        <AppLayout>
            <Head title="Events" />

            <div className="container mx-auto px-4 py-8">
                <Dialog>
                    <DialogTrigger asChild>
                        {auth.user.role === 'admin' || auth.user.role === 'it_staff' || auth.user.role === 'lecturer' ? (
                            <Button size="sm" className="mb-4 w-fit">
                                Create Event
                            </Button>
                        ) : null}
                    </DialogTrigger>
                    <CreateEventForm categories={categories} />
                </Dialog>

                {/* Tabs for Filters */}
                <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'upcoming' | 'past')}>
                    <TabsList className="mb-8 flex justify-center space-x-4">
                        <TabsTrigger value="upcoming" className="px-4 py-2">
                            Upcoming Events
                        </TabsTrigger>
                        <TabsTrigger value="past" className="px-4 py-2">
                            Past Events
                        </TabsTrigger>
                    </TabsList>

                    {/* Upcoming Events */}
                    <TabsContent value="upcoming">
                        {upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {upcomingEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        isCreator={auth.user.id === event.created_by || auth.user.role === 'admin' || auth.user.role === 'it_staff'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No upcoming events found.</p>
                        )}
                    </TabsContent>

                    {/* Past Events */}
                    <TabsContent value="past">
                        {pastEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {pastEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        isCreator={auth.user.id === event.created_by || auth.user.role === 'admin' || auth.user.role === 'it_staff'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No past events found.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

// Define props interface for EventCard component
interface EventCardProps {
    event: Event;
    isCreator: boolean;
}

// Event Card Component
function EventCard({ event, isCreator }: EventCardProps) {
    const { delete: destroy } = useForm();
    const [eventIdToDelete, setEventIdToDelete] = React.useState(Number);
    const handleDeleteEvent = () => {
        destroy(route('event.destroy', eventIdToDelete));
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105">
                    {/* Image */}
                    <CardHeader className="relative">
                        <img
                            src={event.event_image ? `/storage/${event.event_image}` : '/no-image.jpg'}
                            alt={event.title}
                            className="h-48 w-full object-cover"
                        />
                    </CardHeader>

                    {/* Details */}
                    <CardContent className="p-4">
                        <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                        <CardDescription className="mt-2 text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</CardDescription>
                    </CardContent>
                </Card>
            </DialogTrigger>

            {/* Event Details Dialog */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                    <DialogDescription>
                        Date: {new Date(event.date).toLocaleDateString()}, Time: {event.time}
                    </DialogDescription>
                    <DialogDescription>Location: {event.venue}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {event.event_image && (
                        <img src={`/storage/${event.event_image}`} alt={event.title} className="h-64 w-full rounded-md object-cover" />
                    )}
                    {event.registration_link != null && (
                        <Button className="w-full" asChild>
                            <Link href={event.registration_link!} target="_blank">
                                Register Now
                            </Link>
                        </Button>
                    )}
                    <div className="space-y-2">
                        <h4 className="font-semibold">Description</h4>
                        <p className="text-sm text-gray-600">{event.description || 'No description available.'}</p>
                    </div>
                </div>

                {/* Sticky Edit/Delete Buttons for Creator */}
                {isCreator && (
                    <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white py-4">
                        <Button variant="outline" asChild>
                            <Link href={route('event.edit', { id: event.id })}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setEventIdToDelete(event.id);
                                handleDeleteEvent();
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
