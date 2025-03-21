import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Define interfaces
interface Category {
    id: number;
    name: string;
}

interface FormData {
    event_category_id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    target_audience: string;
    event_image: File | null;
    description: string;
    registration_link: string;
    [key: string]: string | File | null;
}

interface CreateProps {
    categories: Category[];
}

export default function CreateEventForm({ categories }: CreateProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<FormData>({
        event_category_id: '',
        title: '',
        date: '',
        time: '',
        venue: '',
        target_audience: '',
        event_image: null,
        description: '',
        registration_link: '',
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('event_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const typedKey = key as keyof FormData;
            if (typedKey === 'event_image' && data[typedKey]) {
                formData.append(key, data[typedKey] as File);
            } else {
                formData.append(key, data[typedKey] as string);
            }
        });
        post(route('events.store'), {
            onSuccess: () => {
                reset();
                setImagePreview(null);
            },
        });
    };

    return (
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Event Category */}
                <div>
                    <Label htmlFor="event_category_id">Category</Label>
                    <Select
                        value={data.event_category_id}
                        required
                        onValueChange={(value: string) => setData('event_category_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.event_category_id && (
                        <span className="text-red-500 text-sm">{errors.event_category_id}</span>
                    )}
                </div>
                {/* Title */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                        placeholder="Event Title"
                        required
                    />
                    {errors.title && (
                        <span className="text-red-500 text-sm">{errors.title}</span>
                    )}
                </div>
                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setData('date', e.target.value)}
                            required
                        />
                        {errors.date && (
                            <span className="text-red-500 text-sm">{errors.date}</span>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            type="time"
                            value={data.time}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setData('time', e.target.value)}
                            required
                        />
                        {errors.time && (
                            <span className="text-red-500 text-sm">{errors.time}</span>
                        )}
                    </div>
                </div>
                {/* Venue */}
                <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                        id="venue"
                        type="text"
                        value={data.venue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setData('venue', e.target.value)}
                        placeholder="Event Venue"
                        required
                    />
                    {errors.venue && (
                        <span className="text-red-500 text-sm">{errors.venue}</span>
                    )}
                </div>
                {/* Target Audience */}
                <div>
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Input
                        id="target_audience"
                        type="text"
                        value={data.target_audience}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setData('target_audience', e.target.value)}
                        placeholder="Target Audience"
                        required
                    />
                    {errors.target_audience && (
                        <span className="text-red-500 text-sm">{errors.target_audience}</span>
                    )}
                </div>
                {/* Event Image Upload */}
                <div>
                    <Label htmlFor="event_image">Event Image</Label>
                    <Input
                        id="event_image"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-32 rounded-md w-32 object-cover"
                            />
                        </div>
                    )}
                    {errors.event_image && (
                        <span className="text-red-500 text-sm">{errors.event_image}</span>
                    )}
                </div>
                {/* Description */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                        placeholder="Event Description"
                        className="border p-2 rounded-md w-full"
                        rows={4}
                        required
                    />
                    {errors.description && (
                        <span className="text-red-500 text-sm">{errors.description}</span>
                    )}
                </div>
                {/* Registration Link */}
                <div>
                    <Label htmlFor="registration_link">Registration Link</Label>
                    <Input
                        id="registration_link"
                        type="url"
                        value={data.registration_link}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setData('registration_link', e.target.value)}
                        placeholder="Optional Registration Link"
                    />
                    {errors.registration_link && (
                        <span className="text-red-500 text-sm">{errors.registration_link}</span>
                    )}
                </div>
                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Event'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}