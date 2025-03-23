import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

interface Resource {
    id: number;
    name: string;
}

interface CreateReservationFormProps {
    resources: Resource[];
    userRole: string;
}

export default function CreateReservationForm({ resources, userRole }: CreateReservationFormProps) {
    const isStudent = userRole === 'student';
    const isAdminOrStaff = (userRole === 'admin' || userRole === 'it_staff');

    const { data, setData, post, processing, errors, reset } = useForm({
        resource_id: '',
        start_date_time: '',
        end_date_time: '',
        purpose: '',
        description: '',
        course: '',
        batch: '',
        approval_status: 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="resource_id">Resource</Label>
                <Select onValueChange={(value) => setData('resource_id', value)} value={data.resource_id} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a resource" />
                    </SelectTrigger>
                    <SelectContent>
                        {resources.map((resource) => (
                            <SelectItem key={resource.id} value={resource.id.toString()}>
                                {resource.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.resource_id && <p className="text-sm text-red-500">{errors.resource_id}</p>}
            </div>

            <div>
                <Label htmlFor="start_date_time">Start Date and Time</Label>
                <Input
                    id="start_date_time"
                    type="datetime-local"
                    value={data.start_date_time}
                    onChange={(e) => setData('start_date_time', e.target.value)}
                    required
                />
                {errors.start_date_time && <p className="text-sm text-red-500">{errors.start_date_time}</p>}
            </div>

            <div>
                <Label htmlFor="end_date_time">End Date and Time</Label>
                <Input
                    id="end_date_time"
                    type="datetime-local"
                    value={data.end_date_time}
                    onChange={(e) => setData('end_date_time', e.target.value)}
                    required
                />
                {errors.end_date_time && <p className="text-sm text-red-500">{errors.end_date_time}</p>}
            </div>

            <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Input id="purpose" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} required />
                {errors.purpose && <p className="text-sm text-red-500">{errors.purpose}</p>}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} required />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {isStudent ? (
                <>
                    <div>
                        <Label htmlFor="course">Course</Label>
                        <Input id="course" value={data.course} onChange={(e) => setData('course', e.target.value)} required />
                        {errors.course && <p className="text-sm text-red-500">{errors.course}</p>}
                    </div>

                    <div>
                        <Label htmlFor="batch">Batch</Label>
                        <Input id="batch" value={data.batch} onChange={(e) => setData('batch', e.target.value)} required />
                        {errors.batch && <p className="text-sm text-red-500">{errors.batch}</p>}
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <Label htmlFor="course">Course (optional)</Label>
                        <Input id="course" value={data.course} onChange={(e) => setData('course', e.target.value)} />
                        {errors.course && <p className="text-sm text-red-500">{errors.course}</p>}
                    </div>

                    <div>
                        <Label htmlFor="batch">Batch (optional)</Label>
                        <Input id="batch" value={data.batch} onChange={(e) => setData('batch', e.target.value)} />
                        {errors.batch && <p className="text-sm text-red-500">{errors.batch}</p>}
                    </div>
                </>
            )}

            {isAdminOrStaff && (
                <div>
                    <Label htmlFor="approval_status">Approval Status</Label>
                    <Select onValueChange={(value) => setData('approval_status', value)} value={data.approval_status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.approval_status && <p className="text-sm text-red-500">{errors.approval_status}</p>}
                </div>
            )}

            <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Reservation'}
            </Button>
        </form>
    );
}
